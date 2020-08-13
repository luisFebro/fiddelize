const User = require("../../models/user");
const BackupUser = require('../../models/backup/BackupUser');
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const { msgG } = require('../_msgs/globalMsgs');
const { msg } = require('../_msgs/user');
const validateEmail = require('../../utils/validation/validateEmail');
const { ObjectId } = mongoose.Types;
const generateHistoryData = require("../../utils/biz-algorithms/purchase-history/generateHistoryData");
const generatePrizeCard = require("../../utils/biz-algorithms/purchase-history/generatePrizeCard");
const addTransformToImgUrl = require("../../utils/biz-algorithms/cloudinary-images/addTransformToImgUrl");
const { findOneAndUpdate, confirmPrizeStatus } = require("./helpers/purchase-history");
const { getTrophyData, insertElemWithPlaceholder, defaultSemisecret, defaultSecret } = require("./helpers/prizes-gallery");
const cloudinary = require('cloudinary').v2;
const { CLIENT_URL } = require('../../config');
const getDataChunk = require("../../utils/array/getDataChunk");
const filterAndCount = require("../../utils/array/filterAndCount");
// fetching enum values exemple:
// console.log(User.schema.path("role").enumValues); [ 'admin', 'colaborador', 'cliente' ]

// MIDDLEWARES - mw
exports.mwUserId = (req, res, next, id) => {
    let { select } = req.query;
    if(!select) select = "";

    User.findById(id)
    .select(select)
    .exec((err, user) => {
        if(err || !user) return res.status(400).json(msg("error.notFound"));
        req.profile = user;
        next();
    });
};

exports.mwBackup = (req, res, next) => {
    const { name } = req.profile;
    const data = {
        subject: name,
        backup: req.profile
    }

    let backup = new BackupUser(data);

    backup.save((err => {
        if(err) return res.status(500).json(msgG('error.systemError', err));
        console.log(msgG("ok.backupSuccess", `do usuário ${name.toUpperCase()}`, 'onlyMsg'))
    }))

    next();
}
// END MIDDLEWARE

const handleUserRole = (isAdmin, profile, opts = {}) => {
    const { includes } = opts;

    if(isAdmin) {
        const cliAdminObj = profile.clientAdminData;
        cliAdminObj.verificationPass = undefined;
        cliAdminObj.bizPlanCode = undefined;

        return cliAdminObj;
    } else {
        profile.password = undefined;
        profile.clientAdminData = undefined;
        if(profile.clientUserData) { // for cli-admin login conflict avoidance...
            if(includes !== "purchaseHistory") {
                profile.clientUserData.purchaseHistory = undefined; // Not working.. this does not need toload at first because we add this when the component loads. Both online and offline.
            }
        }
        return profile;
    }
}

exports.read = (req, res) => {
    const includes = req.query.includes; // includes for testing, allows strict data to be displayed
    const clientAdminRequest = Boolean(req.query.clientAdminRequest);

    return res.json(handleUserRole(clientAdminRequest, req.profile, { includes }));
};

exports.update = (req, res) => { // n2
    const noResponse = Boolean(req.query.noResponse);
    const selectedString = req.query.selectedKeys ? `${req.query.selectedKeys}`  : ''; //-cpf -clientAdminData.bizPlanCode -clientAdminData.verificationPass

    User.findOneAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true }) // real time updated! this send the most recently updated response/doc from database to app
    .select(selectedString)
    .exec((err, user) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));
        const dataToSend = noResponse ? { msg: 'user updated'} : user;
        res.json(dataToSend);
    });
};

exports.remove = (req, res) => { //needs to put auth as middleware
    const user = req.profile;
    user.remove((err, data) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));
        res.json(msg('ok.userDeleted', data.name.toUpperCase()));
    });
}

exports.confirmUserAccount = (req, res) => {
    const { authUserId } = req.params
    User.findById(authUserId)
    .exec((err, user) => {
        if(!user) return res.status(404).json(msg('error.notFoundConfirmation'))
        if(err) return res.status(500).json(msgG('error.systemError', err));

        const { isUserConfirmed, name } = user;

        if(user && !isUserConfirmed) {
            User.findByIdAndUpdate(authUserId, { isUserConfirmed: true })
            .exec(err => {
                if(err) return res.status(500).json(msgG('error.systemError', err));
                res.json(msg('ok.userConfirmed', name));
            })
        }
        else {
            res.status(400).json(msg('error.userAlreadyConfirmed'))
        }
    })
}

exports.addElementArray = (req, res) => {
    const objToChange = req.body; // n2
    const _id = req.params.id;
    User.findByIdAndUpdate(_id, { $push: objToChange }, { new: true })
    .exec((err, user) => {
        if (err) return res.status(500).json(msgG('error.systemError', err)) // NEED CREATE
        res.json({
            user,
            msg: msgG('ok.added', 'onlyMsg')
        });
    });
}

exports.removeElementArray = (req, res) => {
    const objToChange = req.body;
    const _id = req.params.id;
    User.findByIdAndUpdate(_id, { $pull: objToChange }, { new: true })
    .exec((err, user) => {
        if (err) return res.status(500).json(msgG('error.systemError', err)) // NEED CREATE
        res.json({
            user,
            msg: msgG('ok.removed', 'onlyMsg')
        });
    });
}

exports.removeField = (req, res) => { // n1
    let targetField = req.body.fieldToBeDeleted;
    User.findById(req.params.id)
    .exec((err, selectedUser) => {
        if(selectedUser[targetField] === "[]") return res.status(400).json(msgG("error.notRemovedField", targetField))

        selectedUser.set(targetField, undefined, {strict: false} );
        selectedUser.save(() => res.json(msgG("ok.removedField", targetField)))
    })
}

// LISTS
const getQuery = (role) => {
    let mainQuery;
    const me = {_id: { $ne: ObjectId("5e360888051f2617d0df2245")}};
    const adminStaffQuery = {"$or": [{role: "client-admin"}, {role: "admin"}, {role: "colaborador"}]};
    const withNonEmptyArray = { $exists: true, $ne: [] }; // staffBookingList: withNonEmptyArray}

    switch(role) {
        case 'cliente':
            mainQuery = {$or: [{ role: 'cliente'}, {role: 'cliente-admin'}]}; // for test mode in the dashboard, it is requires to search both client and client-admin;
            break;
        case 'cliente-admin':
            mainQuery = { role: 'cliente-admin' };
            break;
        case 'colaborador':
             // This is not being used. Check getStaffWithBookings in admin
            mainQuery = { role: 'colaborador' };
            break;
        case 'colaborador-e-admin':
            mainQuery = {$and: [me, adminStaffQuery]}
            break;
        default:
            mainQuery = {};
    }
    return {
        mainQuery
    }
}

exports.getList = (req, res) => { // n3 - New way of fetching data with $facet aggreagtion
    const skip = parseInt(req.query.skip);
    const role = req.query.role;
    const search = req.query.search;
    const bizId = req.query.bizId;

    const defaultSort = { role: -1 }; // for always sort considering client-admin as priority as test mode to be easy to be detected at client history.
    const sortQuery = {$sort: { ...defaultSort, createdAt: -1 }};
    const skipQuery = {$skip: skip};
    const limitQuery = {$limit: 5};
    const countQuery = {$count: 'value'};
    const searchQuery = {name: {$regex: `${search}`, $options: 'i'}};
    const bizIdQuery = {"clientUserData.bizId": bizId};
    const totalUserGeneralScoresQuery = {$group: { _id: null, value: { $sum: '$clientUserData.totalGeneralScore' }}}
    const totalActiveScoresQuery = {$group: { _id: null, value: { $sum: '$clientUserData.totalActiveScore' }}}

    let { mainQuery } = getQuery(role);

    // For new bizId implementation
    mainQuery = Object.assign({}, mainQuery, bizIdQuery);

    if(search) {
        mainQuery = Object.assign({}, mainQuery, searchQuery);
    }

    User.aggregate([
        {
            $facet: {
                list: [{$match: mainQuery}, sortQuery, skipQuery, limitQuery],
                chunkSize: [{$match: mainQuery}, skipQuery, limitQuery, countQuery],
                totalSize: [{$match: mainQuery}, countQuery],
                totalCliUserScores: [{$match: mainQuery}, totalUserGeneralScoresQuery],
                totalActiveScores: [{$match: mainQuery}, totalActiveScoresQuery],
            }
        }
    ])
    .then(docs => {
        let {
            list,
            chunkSize,
            totalSize,
            totalCliUserScores,
            totalActiveScores,
        } = docs[0];

        // remove sensitive cli-admin data
        // note: check if notification will be include to be excluded too
        const isCliAdmin = list[0].role === "cliente-admin"; // always the first object if available
        if(isCliAdmin) { delete list[0].clientAdminData }

        res.json({
            list,
            chunkSize: chunkSize[0] === undefined ? 0 : chunkSize[0].value,
            totalSize: totalSize[0] === undefined ? 0 : totalSize[0].value,
            totalCliUserScores: totalCliUserScores[0] === undefined ? 0 : totalCliUserScores[0].value,
            totalActiveScores: totalActiveScores[0] === undefined ? 0 : totalActiveScores[0].value,
        })
    })
}

exports.getHighestScores = (req, res) => {
    const bizId = req.query.bizId;

    User.find({ 'clientUserData.bizId': bizId })
    .select("name clientUserData.currScore -_id")
    .sort({ 'clientUserData.currScore': -1 })
    .limit(3)
    .exec((err, data) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));
        res.json(data);
    });
}

exports.readBackup = (req, res) => { //n4 - great recursive solution and insertMany to insert multiple documents at time.
    BackupUser.find({})
    .exec((err, data) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));
        res.json(data);
    });
}

// USER PURCHASE HISTORY
exports.addPurchaseHistory = (req, res) => {
    const { _id, clientUserData } = req.profile;
    if(!clientUserData) return res.json({ error: "requres user data array"});

    const totalNonPrizeCards = clientUserData.purchaseHistory.filter(card => card.cardType === "record").length;
    const lastCardData = clientUserData.purchaseHistory[0];

    const scores = {
        rewardScore: req.body.rewardScore,
        currScore: clientUserData.currScore,
    }

    let [currCard, lastCard] = generateHistoryData(lastCardData, scores, { totalNonPrizeCards, reqBody: req.body });

    // if the lastCard returns with data, this
    // means that we are going to delete the last purchase data and add the last card on the top
    if(lastCard) {
        const lastCardNumber = totalNonPrizeCards;

        User.findOneAndUpdate(
            { _id },
            // remove the last object to update with a new order
            { $pull: { "clientUserData.purchaseHistory": {desc: `Última Compra ${lastCardNumber}`}}},
            { new: false }
        ).exec(err => {
            if(err) return res.status(500).json(msgG('error.systemError', err))
            findOneAndUpdate(User, { res, _id, currCard, lastCard });
        });
    } else {
        // Add without deleting the last card
        findOneAndUpdate(User, { res, _id, currCard, lastCard });
    }
}

exports.readHistoryList = (req, res) => {
    const { _id, clientUserData } = req.profile;
    let { noResponse, skip, limit, challScore, prizeDesc, trophyIcon } = req.query;
    const rewardScore = Number(req.query.rewardScore);
    challScore = typeof challScore === "string" ? challScore : Number(challScore);

    if(!clientUserData) return res.status(400).json([]);

    const purchaseHistory = clientUserData.purchaseHistory;
    const currScore = clientUserData.currScore;

    const options = { rewardScore, currScore, prizeDesc, trophyIcon };
    let newHistoryData = generatePrizeCard(purchaseHistory, options);
    newHistoryData = getDataChunk(newHistoryData, { skip, limit });
    const msgOk ={ msg: "the history list with the latest prizes was read and updated!" };
    const handleFinalRes = () => {
        // challScore = "10_only"
        const scoreOnly = challScore && challScore.includes("only");
        const getScoreNumber = challScore => { const _ind = challScore.indexOf("_"); return Number(challScore.slice(0, _ind)) }
        const rules = [{ challengeN: scoreOnly ? getScoreNumber(challScore) : challScore }, { cardType: "record || remainder" }]
        if(scoreOnly) return filterAndCount(newHistoryData, { count: "value", rules });
        if(challScore) return { list: newHistoryData, challScore: filterAndCount(newHistoryData, { count: "value", rules }) }
        return noResponse === "true" ? msgOk : newHistoryData;
    }
    const finalRes = handleFinalRes();

    const conditionToSave = newHistoryData.length && "prize, remainder".includes(newHistoryData[0].cardType)

    if(conditionToSave) {
        User.findOneAndUpdate({ _id }, { $set: { "clientUserData.purchaseHistory": newHistoryData } }, { new: false })
        .exec((err, user) => {
            if(err) return res.status(500).json(msgG('error.systemError', err));
            res.json(finalRes);
        });
    } else {
        res.json(finalRes);
    }
}

// Prizes
exports.readPrizes = (req, res) => {
    const { cliAdminId, lastPrizeDate = false, lastPrizeId = false } = req.query;
    const { clientUserData: { purchaseHistory } } = req.profile;

    const cliUserPrizes = purchaseHistory.filter(card => card.cardType === "prize"); //returns [] if none
    if(lastPrizeDate && cliUserPrizes.length) return res.json(cliUserPrizes[0].createdAt);
    if(lastPrizeId && cliUserPrizes.length) return res.json(cliUserPrizes[0]._id);

    if(!cliAdminId) return res.status(404).json({ error: "cliAdminId query missing"})
    User.findById(cliAdminId)
    .select("clientAdminData.rewardList clientAdminData.arePrizesVisible")
    .exec((err, data) => {
        if(err) return res.status(400).json(msg("error.notFound"));

        let { rewardList, arePrizesVisible } = data.clientAdminData;
        arePrizesVisible = Boolean(arePrizesVisible);
        const isProgressiveMode = rewardList.length > 1;

        const cliUserPrizesTotal = cliUserPrizes.length;
        const cliAdminPrizesTotal = cliUserPrizes.length;
        const needPlaceholdersMap = cliUserPrizesTotal <= cliAdminPrizesTotal;

        const trophyElems = !cliUserPrizes ? [] : cliUserPrizes.map(trophy => getTrophyData(trophy));
        const placeholders = needPlaceholdersMap && rewardList.map((challenge, ind) =>  {
            const challN = rewardList.length - ind;
            const lastInd = rewardList.length - (ind + 1);

            const challIcon = rewardList[lastInd].icon;
            const finalGoal = rewardList[lastInd].rewardScore;
            const prizeDesc = rewardList[lastInd].rewardDesc;

            return arePrizesVisible
            ? defaultSemisecret({ challIcon, finalGoal, challN, prizeDesc })
            : defaultSecret({ challN })
        });

        const finalData = insertElemWithPlaceholder({ elemList: trophyElems, placeholderList: placeholders });

        res.json(finalData);
    });

}

exports.changePrizeStatus = (req, res) => {
    const { _id, clientUserData } = req.profile;
    let { statusType, newValue = undefined, prizeId } = req.query;

    if(!"confirmed, received".includes(statusType)) return res.status(400).json({msg: "This status type is not valid. Choose one of these: confirmed, received"})
    if(!clientUserData) return res.json({ error: "no array data found"})

    const historyData = clientUserData.purchaseHistory;
    const { newData, newChallengeN, error, status } = confirmPrizeStatus(historyData, { statusType, newValue, prizeId });

    if(status === "FAIL") return res.status(404).json({ error });


    User.findById(_id) // LESSON - do not use select with SAVE.
    .exec((err, doc) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));
        doc.clientUserData.purchaseHistory = newData;
        doc.clientUserData.totalPurchasePrize = newChallengeN;
        // modifying an array require we need to manual tell the mongoose the it is modified. reference: https://stackoverflow.com/questions/42302720/replace-object-in-array-in-mongoose
        doc.markModified("clientUserData");
        doc.save(err => res.json({msg: `The status ${statusType.toUpperCase()} was successfully set challenge N.º ${newChallengeN}!`}))
    });
}
// End Prizes
// END USER PURCHASE HISTORY

exports.countField = (req, res) => {
    const { _id } = req.profile;
    const { field, type } = req.body;

    if(!field) return res.status(400).json({msg: "A field from DB should be specified and sent inside object"})
    // default is "asc" or "inc" which does not need to bespecified.
    let countingField = { [field]: 1 };
    if(type === "dec") {
        countingField = { [field]: -1 };
    }

    User.findOneAndUpdate(
        { _id },
        { $inc: countingField },
        { new: false })
    .exec(err => {
        if(err) return res.status(500).json(msgG("error.systemError", err));
        res.json(`the field ${field.cap()} was updated`);
    })
}

exports.redirectUrlLink = (req, res) => {
    const mainHash = req.query.code;
    const typeLink = req.query.type || "cli";

    if(!mainHash) return res.status(400).json({ msg: "Link Inválido"});

    let code = mainHash;
    let name;
    const needSplit = mainHash.includes("_");
    if(needSplit) {
        const slashInd = mainHash.indexOf("_");
        name = mainHash.slice(0, slashInd);
        code = mainHash.slice(slashInd + 1);
    }

    User.find({'clientAdminData.bizCodeName': {$regex: `${code}`, $options: 'i'} })
    .select("_id role clientAdminData.bizName")
    .exec((err, userArray) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));
        if(!userArray.length) return res.status(400).json({ msg: "Link Inválido"});
        if(userArray[0].role !== "cliente-admin") return res.status(400).json({ msg: "Link Inválido"});

        const user = userArray[0];
        const cliUser = user.clientAdminData;

        const firstName = name;
        const bizId = user._id;
        const bizName = cliUser.bizName;  //"You%20Vipp%20Shop"; //addSpace(bizName.cap())

        let finalUrl;
        name
        ? finalUrl = `${CLIENT_URL}/baixe-app/${firstName}?negocio=${bizName}&id=${bizId}&cliente=1`
        : finalUrl = `${CLIENT_URL}/baixe-app?negocio=${bizName}&id=${bizId}&cliente=1`

        res.json(finalUrl);
        // res.redirect(301, "https://youtube.com");
    });
}

// IMAGES UPLOAD
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// request: post
exports.uploadImages = (req, res) => { // n6 - multiple images promise.
    const fileRoot = req.files;
    const imagePath = fileRoot.file.path; // n7 e.g data
    const _id = req.query.id;
    const fileName = req.query.fileName;

    const options = {
        public_id: fileName,
        use_filename: false, // use file name as public_id
        image_metadata: true,
        quality_analysis: true,
        quality: 90,
        tags: "logo",
        backup: true,
        // folder: "trade-marks/",
    }

    cloudinary.uploader.upload(imagePath, options)
    .then(fileResult => {
        const generatedUrl = addTransformToImgUrl(fileResult.secure_url);
        User.findByIdAndUpdate(_id, { $set: { "clientAdminData.selfBizLogoImg": generatedUrl }})
        .exec(err => {
            if(err) return res.status(500).json(msgG('error.systemError', err));
            res.json(generatedUrl);
        })
    })
    .catch(err => res.status(500).json(msgG("error.systemError", err)))
}

exports.updateImages = (req, res) => {
    const _id = req.query.id;
    const { lastUrl, paramArray, customParam } = req.body;

    const updatedUrl = addTransformToImgUrl(lastUrl, paramArray);
    User.findByIdAndUpdate(_id, { $set: { "clientAdminData.selfBizLogoImg": updatedUrl }})
    .exec(err => {
        if(err) return res.status(500).json(msgG('error.systemError', err));
        res.json(updatedUrl);
    })
}
// END IMAGES UPLOAD


// CHALLENGES AND REWARDS
//@request get - if it is false, then the user can delete certain challenge.
exports.gotUsersInThisChallenge = (req, res) => {
    const bizId = req.query.id;
    const challengeInd = Number(req.query.challengeInd);

    User.find({ role: "cliente", "clientUserData.bizId": bizId,  "clientUserData.totalPurchasePrize": challengeInd })
    .select("clientUserData.totalPurchasePrize")
    .exec((err, data) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));
        let result;
        data.length
        ? result = data.length
        : result = false;
        res.json(result);
    })
}
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
n3:
Need test this in future implementation in the effort to cut down more the boilerplate
in the current working implementation:
db.collection.aggregate([

     //{$sort: {...}}

     //{$match:{...}}

     {$facet:{

       "stage1" : [ $group:{_id:null, count:{$sum:1}} ],

       "stage2" : [ { "$skip": 0}, {"$limit": 2} ]

     }},


    {$unwind: "$stage1"},

     //output projection
    {$project:{
       count: "$stage1.count",
       data: "$stage2"
    }}

]);

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

n6
app.post('/image-upload', (req, res) => {

  const values = Object.values(req.files)
  const promises = values.map(image => cloudinary.uploader.upload(image.path))

  Promise.all(promises)
    .then(results => res.json(results))
    .catch((err) => res.status(400).json(err))
})

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