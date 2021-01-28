const User = require("../../models/user");
const BackupUser = require("../../models/backup/BackupUser");
const mongoose = require("mongoose");
const { msgG } = require("../_msgs/globalMsgs");
const { msg } = require("../_msgs/user");
const validateEmail = require("../../utils/validation/validateEmail");
const {
    jsEncrypt,
    decryptSync,
    encryptSync,
    jsDecrypt,
} = require("../../utils/security/xCipher");
const { getMemberJob, getFinalUrl } = require("./helpers/redirectUrlLink");

// fetching enum values exemple:
// console.log(User.schema.path("role").enumValues); [ 'admin', 'colaborador', 'cliente' ]

// MIDDLEWARES - mw
exports.mwUserId = async (req, res, next, id) => {
    let { select, thisRole } = req.query; // thisRole when a specific app is targeted.
    if (!select) select = "";

    // console.log("originalUrl", req.originalUrl);

    let role = thisRole;
    if (!thisRole) {
        const { role: accountRole } = await req.getAccount(req.params.userId);
        role = accountRole;
    }

    User(role)
        .findById(id)
        .select(select)
        .exec((err, user) => {
            if (err || !user)
                return res.status(400).json(msg("error.notFound"));
            if (user.cpf) {
                user.cpf = jsDecrypt(user.cpf);
            }
            req.profile = user;
            req.role = role;
            next();
        });
};

exports.mwBackup = (req, res, next) => {
    const { name } = req.profile;
    const data = {
        subject: name,
        backup: req.profile,
    };

    let backup = new BackupUser(data);

    backup.save((err) => {
        if (err) return res.status(500).json(msgG("error.systemError", err));
        console.log(
            msgG(
                "ok.backupSuccess",
                `do usuário ${name.toUpperCase()}`,
                "onlyMsg"
            )
        );
    });

    next();
};
// END MIDDLEWARE

const handleUserRole = (isAdmin, profile, opts = {}) => {
    const { includes } = opts;

    if (isAdmin) {
        const cliAdminObj = profile.clientAdminData;

        cliAdminObj.verificationPass = undefined;
        cliAdminObj.bizPlanCode = undefined;
        cliAdminObj.notifications = undefined;
        cliAdminObj.tasks = undefined;
        cliAdminObj.orders = undefined;
        cliAdminObj.allowedTempLinks = undefined;
        cliAdminObj.lastCC = undefined;

        return cliAdminObj;
    } else {
        profile.phone = decryptSync(profile.phone);
        profile.email = decryptSync(profile.email);

        profile.password = undefined;
        profile.clientAdminData = undefined;
        if (profile.clientUserData) {
            // for cli-admin login conflict avoidance...
            if (includes !== "purchaseHistory") {
                profile.clientUserData.purchaseHistory = undefined; // Not working.. this does not need toload at first because we add this when the component loads. Both online and offline.
            }
        }
        return profile;
    }
};

exports.read = (req, res) => {
    const includes = req.query.includes; // includes for testing, allows strict data to be displayed
    const clientAdminRequest = Boolean(req.query.clientAdminRequest);

    return res.json(
        handleUserRole(clientAdminRequest, req.profile, { includes })
    );
};

exports.update = async (req, res) => {
    // n2
    const noResponse = Boolean(req.query.noResponse);
    const selectedString = req.query.selectedKeys
        ? `${req.query.selectedKeys}`
        : ""; //-cpf -clientAdminData.bizPlanCode -clientAdminData.verificationPass

    if (req.body.phone) {
        req.body.phone = encryptSync(req.body.phone);
    }
    if (req.body.email) {
        req.body.email = encryptSync(req.body.email);
    }
    if (req.body.cpf) {
        req.body.cpf = jsEncrypt(req.body.cpf);
    }

    const role = req.role;
    User(role)
        .findOneAndUpdate(
            { _id: req.profile._id },
            { $set: req.body },
            { new: true }
        ) // real time updated! this send the most recently updated response/doc from database to app
        .select(selectedString)
        .exec((err, user) => {
            if (err)
                return res.status(500).json(msgG("error.systemError", err));
            const dataToSend = noResponse ? { msg: "user updated" } : user;
            res.json(dataToSend);
        });
};

exports.remove = (req, res) => {
    //needs to put auth as middleware
    const user = req.profile;
    user.remove((err, data) => {
        if (err) return res.status(500).json(msgG("error.systemError", err));
        res.json(msg("ok.userDeleted", data.name.toUpperCase()));
    });
};

exports.confirmUserAccount = async (req, res) => {
    const { authUserId } = req.params;
    const { role } = await req.getAccount(authUserId);

    User(role)
        .findById(authUserId)
        .exec((err, user) => {
            if (!user)
                return res.status(404).json(msg("error.notFoundConfirmation"));
            if (err)
                return res.status(500).json(msgG("error.systemError", err));

            const { isUserConfirmed, name } = user;

            if (user && !isUserConfirmed) {
                User(role)
                    .findByIdAndUpdate(authUserId, { isUserConfirmed: true })
                    .exec((err) => {
                        if (err)
                            return res
                                .status(500)
                                .json(msgG("error.systemError", err));
                        res.json(msg("ok.userConfirmed", name));
                    });
            } else {
                res.status(400).json(msg("error.userAlreadyConfirmed"));
            }
        });
};

exports.addElementArray = async (req, res) => {
    const objToChange = req.body; // n2
    const id = req.params.id;

    const { role } = await req.getAccount(id);

    User(role)
        .findByIdAndUpdate(id, { $push: objToChange }, { new: true })
        .exec((err, user) => {
            if (err)
                return res.status(500).json(msgG("error.systemError", err)); // NEED CREATE
            res.json({
                user,
                msg: msgG("ok.added", "onlyMsg"),
            });
        });
};

exports.removeElementArray = async (req, res) => {
    const objToChange = req.body;
    const id = req.params.id;

    const { role } = await req.getAccount(id);
    User(role)
        .findByIdAndUpdate(id, { $pull: objToChange }, { new: true })
        .exec((err, user) => {
            if (err)
                return res.status(500).json(msgG("error.systemError", err)); // NEED CREATE
            res.json({
                user,
                msg: msgG("ok.removed", "onlyMsg"),
            });
        });
};

exports.removeField = async (req, res) => {
    // n1
    let targetField = req.body.fieldToBeDeleted;
    const id = req.params.id;

    const { role } = await req.getAccount(id);
    User(role)
        .findById(id)
        .exec((err, selectedUser) => {
            if (!selectedUser)
                return res.status(404).json({ msg: "data or user not found" });
            if (selectedUser[targetField] === "[]")
                return res
                    .status(400)
                    .json(msgG("error.notRemovedField", targetField));
            // if(!selectedUser[targetField]) return res.status(404).json({ msg: "this field does not exist or already deleted" });

            selectedUser.set(targetField, undefined, { strict: true });
            selectedUser.save((err) => {
                if (err) return res.json({ error: "shit" });
                res.json(msgG("ok.removedField", targetField));
            });
        });
};

exports.readBackup = (req, res) => {
    //n4 - great recursive solution and insertMany to insert multiple documents at time.
    BackupUser.find({}).exec((err, data) => {
        if (err) return res.status(500).json(msgG("error.systemError", err));
        res.json(data);
    });
};

exports.countField = (req, res) => {
    const { _id, role } = req.profile;
    const { field, type, thisRole } = req.body; // thisRole is more reliable since it is specified which app's role.

    if (!field)
        return res.status(400).json({
            msg: "A field from DB should be specified and sent inside object",
        });
    // default is "asc" or "inc" which does not need to bespecified.
    let countingField = { [field]: 1 };
    if (type === "dec") {
        countingField = { [field]: -1 };
    }

    User(thisRole || role)
        .findOneAndUpdate({ _id }, { $inc: countingField }, { new: false })
        .exec((err) => {
            if (err)
                return res.status(500).json(msgG("error.systemError", err));
            res.json(`the field ${field.cap()} was updated`);
        });
};

exports.redirectUrlLink = async (req, res) => {
    // pedro_nucleo:fiddelize
    const mainHash = req.query.code;
    if (!mainHash) return res.status(400).json({ msg: "Link Inválido" });

    let code = mainHash;

    let name;
    let linkId;
    const needSplit = mainHash.includes("_");
    if (needSplit) {
        const slashInd = mainHash.indexOf("_");
        name = mainHash.slice(0, slashInd);
        code = mainHash.slice(slashInd + 1);
    }

    const isBizTeam = code.includes("nucleo:");

    let memberJob;
    const needTeam = !isBizTeam && code && code.includes(".equipe");
    if (needTeam) {
        const [thisBizCode] = code.split(".");
        const [, jobCode] = code.split("-");
        code = thisBizCode;
        memberJob = getMemberJob(jobCode);
    }

    let userScore;
    const gotScore = !isBizTeam && code && code.includes(":");
    if (gotScore) {
        const [thisBizCode, thisUserScore] = code.split(":");
        code = thisBizCode;
        userScore = thisUserScore;
    }

    const needStaffLinkId = !isBizTeam && code && code.length > 7;
    if (needStaffLinkId) {
        const fixedCode = code;
        code = code.slice(0, -1); // remove the last char cuz the eighth number is link id for members
        linkId = Number(fixedCode.slice(-1)); // the last char.
    }

    if (isBizTeam) {
        const twoDotsInd = code.indexOf(":");
        const primaryAgent = code.slice(twoDotsInd + 1);

        const finalUrl = getFinalUrl({ isBizTeam: true, name, primaryAgent });
        return res.json(finalUrl);
    }

    const user = await User("cliente-admin")
        .findOne({
            "clientAdminData.bizCodeName": { $regex: `${code}`, $options: "i" },
        })
        .select(
            "_id role clientAdminData.bizName clientAdminData.selfBizLogoImg clientAdminData.selfThemeBackColor clientAdminData.selfThemePColor clientAdminData.memberIdList"
        )
        .catch((err) => {
            res.json({ error: `${err}` });
        });

    if (!user || user.role !== "cliente-admin")
        return res.status(400).json({ msg: "Link Inválido" });

    const finalUrl = getFinalUrl({ user, name, memberJob, userScore, linkId });

    res.json(finalUrl);
};

// CHALLENGES AND REWARDS
//@request get - if it is false, then the user can delete certain challenge.
exports.gotUsersInThisChallenge = (req, res) => {
    const bizId = req.query.id;
    const challengeInd = Number(req.query.challengeInd);

    User("cliente")
        .find({
            "clientUserData.bizId": bizId,
            "clientUserData.totalPurchasePrize": challengeInd,
        })
        .select("clientUserData.totalPurchasePrize")
        .exec((err, data) => {
            if (err)
                return res.status(500).json(msgG("error.systemError", err));
            let result;
            data.length ? (result = data.length) : (result = false);
            res.json(result);
        });
};
// END CHALLENGES AND REWARDS

/*ARCHIVES
const assignToUndefined = (obj, keysArray) => {
    return keysArray.forEach(key => {
        obj[key] = undefined;
    })
}
assignToUndefined(req.profile, [
    "birthday", "password", "maritalStatus",
    "role", "name", "email", "cpf", "phone",
    "createdAt", "updatedAt", "__v"])

*/

// END LISTS

/* COMMENTS
n1: Only for objects with no default value. Need fix validation and it does not remove keys with default values.
n2: only update one specific key in the document, including objects like "key.prop".targetField. If you update an element of array, all the rest will be gone, updated.
In order to add/remove arrays use add/removeElementArray instead;
n4?
var total = docArray.length
  , result = []
;

function saveAll(){
  var doc = docArray.pop();

  doc.save(function(err, saved){
    if (err) throw err;//handle error

    result.push(saved[0]);

    if (--total) saveAll();
    else // all saved here
  })
}

saveAll();

More: https://stackoverflow.com/questions/10266512/how-can-i-save-multiple-documents-concurrently-in-mongoose-node-js

n7:
Object.values is requires to extract value as object of data.
{ file:
     { fieldName: 'file',
       originalFilename: 'official-logo-name.png',
       path:
        'C:\\Users\\ACESSO~1\\AppData\\Local\\Temp\\_RwJJOzSc3a23hFjJJuaQsgW.png',
       headers:
        { 'content-disposition': 'form-data; name="file"; filename="official-logo-name.png"',
          'content-type': 'image/png' },
       size: 8550,
       name: 'official-logo-name.png',
       type: 'image/png'
/* ARCHIVES
exports.getStaffClientList = (req, res) => {
    const bookingArrayIds = req.profile.staffBookingList;
    const docsToSkip = parseInt(req.query.skip);

    let query;
    let limit;
    if(req.query.search) {
        query = {'clientName': { $regex: `${req.query.search}`, $options: "i" }}
        limit = 10;
    } else {
        query = {'_id': {$in: bookingArrayIds }}
        limit = 5;
    }

    StaffBooking.find(query)
    .exec((err, docs) => {
        const totalOfDocs = docs.length;

        StaffBooking.find(query)
        .sort({ 'status': -1, 'bookingDate': 1 })
        .skip(docsToSkip)
        .limit(limit)
        .exec((err, docs) => {
            if(err) return res.status(500).json(msgG('error.systemError', err));
            res.json({
                size: docs.length,
                totalSize: totalOfDocs,
                docs
            });
        });
    })
}
*/
