const Account = require("../../../models/user/Account");
const User = require("../../../models/user");
const { jsDecrypt, decryptSync } = require("../../../utils/security/xCipher");

/* ACTIONS
1. To add a new account:
needUpdateOnly = false,

2. To add another account:
needUpdateOnly = false,
isAnother = true,

3. To update default:
needUpdateOnly = true;
send all default variables to update (role, bizId, bizImg, bizName)
 */

exports.getAccount = async (userId, options = {}) => {
    const { cpf, accounts = false } = options;

    const query = cpf ? { checkId: cpf } : { defaultUserId: userId };

    const select = accounts ? "accounts -_id" : "defaultRole -_id";

    const data = await Account.findOne(query).select(select);

    if ((!data && accounts) || !data) return { accounts: [] };

    const res = accounts
        ? { accounts: data.accounts }
        : { role: data.defaultRole };

    return res;
};

exports.setNewAccount = async (options = {}) => {
    const {
        cpf,
        userId,
        role,
        bizImg,
        bizName,
        bizId,
        isAnother = false,
        needUpdateOnly = false, // only true for updating the default account!!
    } = options;

    const checkId = cpf;

    if (!checkId) return res.status(400).json({ error: "Missing checkId!" });

    const pushIt = {
        userId,
        bizId,
        role,
        bizImg,
        bizName,
    };

    const payload = {
        checkId,
    };
    const defaults = {
        defaultUserId: userId,
        defaultRole: role,
        defaultBizId: role === "nucleo-equipe" ? "nucleo" : bizId,
        defaultBizName: bizName,
        defaultBizImg: bizImg,
    };

    if (!userId) delete defaults.defaultUserId;
    if (!bizImg) delete defaults.defaultBizImg;
    if (!bizName) delete defaults.defaultBizName;
    if (!role) delete defaults.defaultRole;
    if (!bizId) delete defaults.defaultBizId;

    const setObj = isAnother ? payload : { ...payload, ...defaults };

    const dataSet = needUpdateOnly
        ? { $set: setObj }
        : { $set: setObj, $push: { accounts: pushIt } };

    return await Account.findOneAndUpdate({ checkId }, dataSet, {
        new: true,
        upsert: true,
    }).catch((err) => {
        res.status(500).json({ error: err });
    });
};

exports.findAllUserAccounts = async ({ cpf, userId, role }) => {
    let thisCpf = cpf;

    if (userId) {
        const userResult = await User(role).findById(userId).select("cpf -_id");

        if (!userResult) return Promise.reject({ error: "userId not found" });

        thisCpf = jsDecrypt(userResult.cpf);
    }

    const dataAccount = await Account.findOne({ checkId: thisCpf }).select(
        "accounts -_id"
    );

    if (!dataAccount)
        return Promise.reject({ error: "no account found for this CPF" });

    const allRoles = dataAccount.accounts.map((acc) => acc.role);
    return allRoles;
};

// directly from download page, users who already have downloaded Fiddelize App
// can register informing with CPF
exports.mwCreateInstantAccount = async (req, res, next) => {
    const { role, cpf } = req.body;

    const isCliAdmin = role === "cliente-admin";
    const isCliMember = role === "cliente-membro";
    const isCliUser = role === "cliente";
    const isBizTeam = role === "nucleo-equipe";

    const dataAccount = await Account.findOne({ checkId: cpf }).select(
        "defaultUserId defaultRole -_id"
    );

    if (!dataAccount)
        return res.status(400).json({ error: "CPF informado foi rejeitado." });

    const { defaultUserId, defaultRole } = dataAccount;

    // pswd only for cli-admin and biz-team app
    const dataProfile = await User(defaultRole)
        .findById(defaultUserId)
        .select(
            "name birthday email phone gender pswd clientUserData.filterBirthday -_id"
        );
    if (!dataProfile)
        return res.status(400).json({ error: "usuário não possui conta" });

    const {
        name,
        birthday,
        email,
        phone,
        gender,
        pswd,
        clientUserData,
    } = dataProfile;

    req.body = {
        isInstantAccount: true,
        role, // the new role from download page
        cpf: req.body.cpf,
        bizId: req.body.bizId,
        // profile
        name,
        birthday,
        email,
        phone,
        gender,
        pswd,
        // specific data
        clientUserData: isCliUser
            ? {
                  ...req.body.clientUserData,
                  filterBirthday: clientUserData.filterBirthday,
              }
            : undefined,
        clientAdminData: isCliAdmin
            ? { ...req.body.clientAdminData, bizWhatsapp: decryptSync(phone) }
            : undefined,
        clientMemberData: isCliMember ? req.body.clientMemberData : undefined,
        bizTeamData: isBizTeam ? req.body.bizTeamData : undefined,
        // cli-user
        tempScore: req.body.tempScore,
        memberRole: req.body.memberRole,
        linkCode: req.body.linkCode,
        register: req.body.register,
        // common variables
        bizName: req.body.bizName,
        bizImg: req.body.bizImg,
        filter: req.body.filter,
    };

    next();
};
