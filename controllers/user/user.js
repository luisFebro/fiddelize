const User = require("../../models/user");
const BackupUser = require("../../models/backup/BackupUser");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { msgG } = require("../_msgs/globalMsgs");
const { msg } = require("../_msgs/user");
const validateEmail = require("../../utils/validation/validateEmail");
const generateHistoryData = require("../../utils/biz-algorithms/purchase-history/generateHistoryData");
const generatePrizeCard = require("../../utils/biz-algorithms/purchase-history/generatePrizeCard");
const addTransformToImgUrl = require("../../utils/biz-algorithms/cloudinary-images/addTransformToImgUrl");
const {
    findOneAndUpdate,
    confirmPrizeStatus,
    findLastRecordCard,
} = require("./helpers/purchase-history");
const {
    getTrophyData,
    insertElemWithPlaceholder,
    defaultSemisecret,
    defaultSecret,
} = require("./helpers/prizes-gallery");
const cloudinary = require("cloudinary").v2;
const { CLIENT_URL } = require("../../config");
const {
    getDataChunk,
    getChunksTotal,
} = require("../../utils/array/getDataChunk");
const filterAndCount = require("../../utils/array/filterAndCount");
const {
    jsEncrypt,
    decryptSync,
    jsDecrypt,
} = require("../../utils/security/xCipher");

// fetching enum values exemple:
// console.log(User.schema.path("role").enumValues); [ 'admin', 'colaborador', 'cliente' ]

// MIDDLEWARES - mw
exports.mwUserId = (req, res, next, id) => {
    let { select } = req.query;
    if (!select) select = "";

    User.findById(id)
        .select(select)
        .exec((err, user) => {
            if (err || !user)
                return res.status(400).json(msg("error.notFound"));
            if (user.cpf) {
                user.cpf = jsDecrypt(user.cpf);
            }
            req.profile = user;
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

exports.update = (req, res) => {
    // n2
    const noResponse = Boolean(req.query.noResponse);
    const selectedString = req.query.selectedKeys
        ? `${req.query.selectedKeys}`
        : ""; //-cpf -clientAdminData.bizPlanCode -clientAdminData.verificationPass

    req.body.phone = encryptSync(req.body.phone);
    req.body.email = encryptSync(req.body.email);
    req.body.cpf = jsEncrypt(req.body.cpf);

    User.findOneAndUpdate(
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

exports.confirmUserAccount = (req, res) => {
    const { authUserId } = req.params;
    User.findById(authUserId).exec((err, user) => {
        if (!user)
            return res.status(404).json(msg("error.notFoundConfirmation"));
        if (err) return res.status(500).json(msgG("error.systemError", err));

        const { isUserConfirmed, name } = user;

        if (user && !isUserConfirmed) {
            User.findByIdAndUpdate(authUserId, { isUserConfirmed: true }).exec(
                (err) => {
                    if (err)
                        return res
                            .status(500)
                            .json(msgG("error.systemError", err));
                    res.json(msg("ok.userConfirmed", name));
                }
            );
        } else {
            res.status(400).json(msg("error.userAlreadyConfirmed"));
        }
    });
};

exports.addElementArray = (req, res) => {
    const objToChange = req.body; // n2
    const _id = req.params.id;
    User.findByIdAndUpdate(_id, { $push: objToChange }, { new: true }).exec(
        (err, user) => {
            if (err)
                return res.status(500).json(msgG("error.systemError", err)); // NEED CREATE
            res.json({
                user,
                msg: msgG("ok.added", "onlyMsg"),
            });
        }
    );
};

exports.removeElementArray = (req, res) => {
    const objToChange = req.body;
    const _id = req.params.id;
    User.findByIdAndUpdate(_id, { $pull: objToChange }, { new: true }).exec(
        (err, user) => {
            if (err)
                return res.status(500).json(msgG("error.systemError", err)); // NEED CREATE
            res.json({
                user,
                msg: msgG("ok.removed", "onlyMsg"),
            });
        }
    );
};

exports.removeField = (req, res) => {
    // n1
    let targetField = req.body.fieldToBeDeleted;
    User.findById(req.params.id).exec((err, selectedUser) => {
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

// USER PURCHASE HISTORY
exports.addPurchaseHistory = (req, res) => {
    const { _id, clientUserData } = req.profile;
    if (!clientUserData) return res.json({ error: "requres user data array" });

    const totalNonPrizeCards = clientUserData.purchaseHistory.filter(
        (card) => card.cardType === "record"
    ).length;
    const lastCardData = clientUserData.purchaseHistory[0];

    const scores = {
        rewardScore: req.body.rewardScore,
        currScore: clientUserData.currScore,
    };

    let [currCard, lastCard] = generateHistoryData(lastCardData, scores, {
        totalNonPrizeCards,
        reqBody: req.body,
    });

    // if the lastCard returns with data, this
    // means that we are going to delete the last purchase data and add the last card on the top
    if (lastCard) {
        const lastCardNumber = totalNonPrizeCards;

        User.findOneAndUpdate(
            { _id },
            // remove the last object to update with a new order
            {
                $pull: {
                    "clientUserData.purchaseHistory": {
                        desc: `Última Compra ${lastCardNumber}`,
                    },
                },
            },
            { new: false }
        ).exec((err) => {
            if (err)
                return res.status(500).json(msgG("error.systemError", err));
            findOneAndUpdate(User, { res, _id, currCard, lastCard });
        });
    } else {
        // Add without deleting the last card
        findOneAndUpdate(User, { res, _id, currCard, lastCard });
    }
};

exports.readHistoryList = (req, res) => {
    const { _id, clientUserData } = req.profile;
    let {
        noResponse = false,
        skip,
        limit = 5,
        challengeN,
        prizeDesc,
        trophyIcon,
        isFromDashboard,
    } = req.query;
    isFromDashboard = isFromDashboard === "true";
    const rewardScore = Number(req.query.rewardScore);

    if (!clientUserData) return res.status(400).json([]);

    let currScore = clientUserData.currScore;

    if (!challengeN && !noResponse) return;

    const purchaseHistory = clientUserData.purchaseHistory;

    const options = { rewardScore, currScore, prizeDesc, trophyIcon };
    // admin not allowed to load prizes system to avoid mistakes...
    let newHistoryData = isFromDashboard
        ? purchaseHistory
        : generatePrizeCard(purchaseHistory, options);
    newHistoryData =
        Number(skip) === 0
            ? findLastRecordCard(newHistoryData)
            : newHistoryData;

    const msgOk = {
        msg: "the history list with the latest prizes was read and updated!",
    };

    const handleFinalRes = () => {
        if (noResponse) return noResponse === "true" ? msgOk : dataToSend;
        const rules = [
            { challengeN: Number(challengeN) },
            { cardType: "record || remainder" },
        ];
        const challScore = filterAndCount(newHistoryData, {
            count: "value",
            rules,
            compare: "||",
        });

        const dataSize = newHistoryData.length;
        const dataRes = {
            list: getDataChunk(newHistoryData, { skip, limit }),
            chunksTotal: getChunksTotal(dataSize, limit),
            listTotal: dataSize,
            content: Number(skip) === 0 ? `challScore:${challScore};` : null,
        };

        return dataRes;
    };
    const finalRes = handleFinalRes();

    const conditionToSave =
        newHistoryData.length &&
        "prize, remainder".includes(newHistoryData[0].cardType);

    if (conditionToSave) {
        User.findOneAndUpdate(
            { _id },
            { $set: { "clientUserData.purchaseHistory": newHistoryData } },
            { new: false }
        ).exec((err, user) => {
            if (err)
                return res.status(500).json(msgG("error.systemError", err));
            res.json(finalRes);
        });
    } else {
        res.json(finalRes);
    }
};

// Prizes
exports.readPrizes = (req, res) => {
    // INFINITE SCROLLING NOT IMPLEMNTED
    const {
        cliAdminId,
        lastPrizeDate = false,
        lastPrizeId = false,
        updatedValues = false,
        skip,
        limit = 5,
        rewardScore,
    } = req.query;

    const { clientUserData = {} } = req.profile;
    const {
        purchaseHistory,
        totalPurchasePrize = 0,
        currScore,
    } = clientUserData;

    if (updatedValues) {
        const lastCardChall =
            purchaseHistory[0] && purchaseHistory[0].challengeN;
        const currChall = Boolean(totalPurchasePrize)
            ? totalPurchasePrize + 1
            : 1;
        let nextChall = currChall + 1;

        if (lastCardChall) {
            if (lastCardChall > nextChall) nextChall = ++nextChall;
        }

        const lastRemainder =
            purchaseHistory &&
            purchaseHistory.find(
                (card) =>
                    card.cardType === "remainder" &&
                    card.challengeN === nextChall
            );
        let remainderValue = lastRemainder && lastRemainder.value;

        const rules = [{ challengeN: nextChall }, { cardType: "record" }];
        const nextScore = filterAndCount(purchaseHistory, {
            count: "value",
            rules,
            compare: "includes",
        });

        if (!remainderValue) remainderValue = 0;

        const isLastRemainderCard =
            purchaseHistory[0] && purchaseHistory[0].cardType === "remainder";
        if (isLastRemainderCard) {
            const remainder = purchaseHistory[0].value;
            if (remainder >= Number(rewardScore)) {
                remainderValue = remainder;
            }
        }

        return res.json({
            remainder: remainderValue,
            nextScore,
            updatedCurrScore: currScore,
        });
    }

    const cliUserPrizes =
        purchaseHistory &&
        purchaseHistory.filter((card) => card.cardType === "prize"); //returns [] if none
    if (!cliUserPrizes)
        return res.status(404).json({ error: "no prizes found" });
    if (lastPrizeDate && cliUserPrizes.length)
        return res.json(cliUserPrizes[0].createdAt);
    if (lastPrizeId && cliUserPrizes.length)
        return res.json(cliUserPrizes[0]._id);

    if (!cliAdminId)
        return res.status(404).json({ error: "cliAdminId query missing" });
    User.findById(cliAdminId)
        .select("clientAdminData.rewardList clientAdminData.arePrizesVisible")
        .exec((err, data) => {
            if (err) return res.status(400).json(msg("error.notFound"));

            let { rewardList, arePrizesVisible } = data.clientAdminData;
            arePrizesVisible = Boolean(arePrizesVisible);
            const isProgressiveMode = rewardList.length > 1;

            const cliUserPrizesTotal = cliUserPrizes.length;
            const cliAdminPrizesTotal = cliUserPrizes.length;
            const needPlaceholdersMap =
                cliUserPrizesTotal <= cliAdminPrizesTotal;

            const trophyElems = !cliUserPrizes
                ? []
                : cliUserPrizes.map((trophy) => getTrophyData(trophy));
            const placeholders =
                needPlaceholdersMap &&
                rewardList.map((challenge, ind) => {
                    const challN = rewardList.length - ind;
                    const lastInd = rewardList.length - (ind + 1);

                    const challIcon = rewardList[lastInd].icon;
                    const finalGoal = rewardList[lastInd].rewardScore;
                    const prizeDesc = rewardList[lastInd].rewardDesc;

                    return arePrizesVisible
                        ? defaultSemisecret({
                              challIcon,
                              finalGoal,
                              challN,
                              prizeDesc,
                          })
                        : defaultSecret({ challN });
                });

            const finalData = insertElemWithPlaceholder({
                elemList: trophyElems,
                placeholderList: placeholders,
            });

            res.json({ list: finalData });
        });
};

exports.changePrizeStatus = (req, res) => {
    const { _id, clientUserData } = req.profile;
    let { statusType, newValue = undefined, prizeId } = req.query;

    if (!"confirmed, received".includes(statusType))
        return res.status(400).json({
            msg:
                "This status type is not valid. Choose one of these: confirmed, received",
        });
    if (!clientUserData) return res.json({ error: "no array data found" });

    const historyData = clientUserData.purchaseHistory;
    let totalPrizes = clientUserData.totalPurchasePrize;
    const { newData, newChallengeN, error, status } = confirmPrizeStatus(
        historyData,
        {
            statusType,
            newValue,
            prizeId,
            totalPrizes,
        }
    );

    if (status === "FAIL") return res.status(404).json({ error });

    User.findById(_id) // LESSON - do not use select with SAVE.
        .exec((err, doc) => {
            if (err)
                return res.status(500).json(msgG("error.systemError", err));
            doc.clientUserData.purchaseHistory = newData;
            if (statusType === "confirmed") {
                doc.clientUserData.totalPurchasePrize = newChallengeN;
            }
            // modifying an array require we need to manual tell the mongoose the it is modified. reference: https://stackoverflow.com/questions/42302720/replace-object-in-array-in-mongoose
            doc.markModified("clientUserData");
            doc.save((err) =>
                res.json({
                    msg: `The status ${statusType.toUpperCase()} was successfully set challenge N.º ${newChallengeN}!`,
                })
            );
        });
};
// End Prizes
// END USER PURCHASE HISTORY

exports.countField = (req, res) => {
    const { _id } = req.profile;
    const { field, type } = req.body;

    if (!field)
        return res.status(400).json({
            msg: "A field from DB should be specified and sent inside object",
        });
    // default is "asc" or "inc" which does not need to bespecified.
    let countingField = { [field]: 1 };
    if (type === "dec") {
        countingField = { [field]: -1 };
    }

    User.findOneAndUpdate(
        { _id },
        { $inc: countingField },
        { new: false }
    ).exec((err) => {
        if (err) return res.status(500).json(msgG("error.systemError", err));
        res.json(`the field ${field.cap()} was updated`);
    });
};

exports.redirectUrlLink = (req, res) => {
    const mainHash = req.query.code;
    const typeLink = req.query.type || "cli";

    if (!mainHash) return res.status(400).json({ msg: "Link Inválido" });

    let code = mainHash;
    let name;
    const needSplit = mainHash.includes("_");
    if (needSplit) {
        const slashInd = mainHash.indexOf("_");
        name = mainHash.slice(0, slashInd);
        code = mainHash.slice(slashInd + 1);
    }

    User.find({
        "clientAdminData.bizCodeName": { $regex: `${code}`, $options: "i" },
    })
        .select(
            "_id role clientAdminData.bizName clientAdminData.selfBizLogoImg clientAdminData.selfThemeBackColor"
        )
        .exec((err, userArray) => {
            if (err)
                return res.status(500).json(msgG("error.systemError", err));
            if (!userArray.length)
                return res.status(400).json({ msg: "Link Inválido" });
            if (userArray[0].role !== "cliente-admin")
                return res.status(400).json({ msg: "Link Inválido" });

            const user = userArray[0];
            const cliUser = user.clientAdminData;

            const firstName = name;
            const bizId = user._id;
            const bizName = cliUser.bizName; //"You%20Vipp%20Shop"; //addSpace(bizName.cap())
            const logo = cliUser.selfBizLogoImg;
            const bc = cliUser.selfThemeBackColor;
            const pc = cliUser.selfThemePColor;

            let finalUrl;
            name
                ? (finalUrl = `${CLIENT_URL}/baixe-app/${firstName}?negocio=${bizName}&id=${bizId}&cliente=1&logo=${logo}&bc=${bc}&pc=${pc}`)
                : (finalUrl = `${CLIENT_URL}/baixe-app?negocio=${bizName}&id=${bizId}&cliente=1&logo=${logo}&bc=${bc}&pc=${pc}`);

            res.json(finalUrl);
            // res.redirect(301, "https://youtube.com");
        });
};

// IMAGES UPLOAD
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// request: post
exports.uploadImages = (req, res) => {
    // n6 - multiple images promise.
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
    };

    cloudinary.uploader
        .upload(imagePath, options)
        .then((fileResult) => {
            const generatedUrl = addTransformToImgUrl(fileResult.secure_url);
            User.findByIdAndUpdate(_id, {
                $set: { "clientAdminData.selfBizLogoImg": generatedUrl },
            }).exec((err) => {
                if (err)
                    return res.status(500).json(msgG("error.systemError", err));
                res.json(generatedUrl);
            });
        })
        .catch((err) => res.status(500).json(msgG("error.systemError", err)));
};

exports.updateImages = (req, res) => {
    const _id = req.query.id;
    const { lastUrl, paramArray, customParam } = req.body;

    const updatedUrl = addTransformToImgUrl(lastUrl, paramArray);
    User.findByIdAndUpdate(_id, {
        $set: { "clientAdminData.selfBizLogoImg": updatedUrl },
    }).exec((err) => {
        if (err) return res.status(500).json(msgG("error.systemError", err));
        res.json(updatedUrl);
    });
};
// END IMAGES UPLOAD

// CHALLENGES AND REWARDS
//@request get - if it is false, then the user can delete certain challenge.
exports.gotUsersInThisChallenge = (req, res) => {
    const bizId = req.query.id;
    const challengeInd = Number(req.query.challengeInd);

    User.find({
        role: "cliente",
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
