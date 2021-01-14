const Account = require("../../../models/user/Account");
const User = require("../../../models/user");
const { jsDecrypt, decryptSync } = require("../../../utils/security/xCipher");
const { handleDefaultAccess, changeDefaultAccess } = require("./helpers.js");
const {
    getChunksTotal,
    getDataChunk,
} = require("../../../utils/array/getDataChunk");
const getId = require("../../../utils/getId");

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

exports.readAppList = async (req, res) => {
    const { userId, role, skip, limit = 5 } = req.query;

    const userData = await User(role)
        .findById(userId)
        .select("cpf -_id")
        .catch((e) => {
            res.json(e);
        });
    const cpf = userData && jsDecrypt(userData.cpf);
    const { accounts } = await req.getAccount(null, { cpf, accounts: true });

    const data = accounts;
    const dataSize = data.length;
    const dataChunk = getDataChunk(data, { skip, limit });

    res.json({
        list: dataChunk,
        listTotal: dataSize,
        chunksTotal: getChunksTotal(dataSize, limit),
    });
};

exports.setNewAccount = async (options = {}) => {
    const {
        cpf,
        userId,
        role,
        bizImg,
        bizName,
        bizId,
        // isAnother = false,
    } = options;

    const checkId = cpf;

    if (!checkId) return res.status(400).json({ error: "Missing checkId!" });

    const payload = {
        checkId,
    };

    const appId = getId();

    const defaults = {
        defaultUserId: userId,
        defaultAppId: appId,
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

    const dataAcc = await Account.findOne({ checkId: cpf }).select(
        "accounts -_id"
    );

    const pullIt = {
        userId,
        bizId,
        role,
        bizImg,
        bizName,
    };

    const newAcc = handleDefaultAccess({ appId, dataAcc, pullIt });

    const setObj = { ...payload, ...defaults, accounts: newAcc };

    const dataSet = { $set: setObj };

    return await Account.findOneAndUpdate({ checkId }, dataSet, {
        new: true,
        upsert: true,
    }).catch((err) => {
        res.status(400).json({ error: err });
    });
};

exports.setDefaultAccess = async (req, res) => {
    const {
        userId, // userId and userRole is required because we have to looking for the user's CPF so that we can find the right accounts
        userRole,
        appId,
    } = req.body;

    const userData = await User(userRole)
        .findById(userId)
        .select("cpf -_id")
        .catch((e) => {
            res.json(e);
        });
    const cpf = userData && jsDecrypt(userData.cpf);

    const { accounts } = await req.getAccount(null, { cpf, accounts: true });
    const setObj = changeDefaultAccess({ accounts, appId });

    const dataSet = { $set: setObj };

    const done = await Account.findOneAndUpdate({ checkId: cpf }, dataSet, {
        new: true,
        upsert: true,
    }).catch((err) => {
        res.status(400).json({ error: err });
    });
    if (!done) return;

    return res.json({ msg: "default account was updated." });
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
        pswd, // only for cli-admin and biz-team. They should have the same password
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

/* ARCHIVES
const pullElem = (field, elem) => {
    const targetElem = { $each: [elem], $position: 0 }; // first in, first out.
    const fieldAndElem = { [field]: targetElem };

    return { $push: fieldAndElem };
};
*/
