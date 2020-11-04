const Account = require("../../../models/user/Account");

/* ACTIONS
1. To add a new account:
needUpdateOnly = false,

2. To add a second or another account:
needUpdateOnly = false,
isAnother = true,

3. To update default:
needUpdateOnly = true;
send all default variables to update (role, bizId, bizImg)
 */
exports.setNewAccount = async (req, res) => {
    const {
        checkId, // cpf
        role,
        bizId,
        bizImg,
        isAnother = false,
        needUpdateOnly = false, // only for initial account or when user changes the default account
    } = req.body;

    if (!checkId) return res.status(400).json({ error: "Missing checkId!" });

    const defaults = {
        defaultRole: role,
        defaultBizId: bizId,
        defaultBizImg: bizImg,
    };

    if (!bizImg) delete defaults.defaultBizImg;
    if (!role) delete defaults.defaultRole;
    if (!bizId) delete defaults.defaultBizId;

    const payload = {
        checkId,
    };

    const pushIt = {
        role,
        bizId,
        bizImg,
    };

    const setObj = isAnother ? payload : { ...payload, ...defaults };

    const dataSet = needUpdateOnly
        ? { $set: setObj }
        : { $set: setObj, $push: { accounts: pushIt } };

    const data = await Account.findOneAndUpdate({ checkId }, dataSet, {
        new: true,
        upsert: true,
    }).catch((err) => {
        res.status(500).json({ error: err });
    });

    if (data) {
        res.json({
            msg: `${
                !role ? "account" : `new ${role} account`
            } created or updated`,
        });
    }
};
