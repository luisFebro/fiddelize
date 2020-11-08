const Account = require("../../../models/user/Account");

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

    if (!data && accounts) return { accounts: [] };

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
        defaultBizId: bizId,
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
