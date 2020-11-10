const User = require("../../../models/user");
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
const { generateHistoryData } = require("./algorithms/generateHistoryData");
const { generatePrizeCard } = require("./algorithms/generatePrizeCard");
const filterAndCount = require("../../../utils/array/filterAndCount");
const {
    getDataChunk,
    getChunksTotal,
} = require("../../../utils/array/getDataChunk");
const { msgG } = require("../../_msgs/globalMsgs");
const { msg } = require("../../_msgs/user");

exports.addPurchaseHistory = async (req, res) => {
    const { _id, clientUserData } = req.profile;
    if (!clientUserData) return res.json({ error: "requres user data array" });

    const { role } = await req.getAccount(id);

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

        User(role)
            .findOneAndUpdate(
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
            )
            .exec((err) => {
                if (err)
                    return res.status(500).json(msgG("error.systemError", err));
                findOneAndUpdate(User(role), { res, _id, currCard, lastCard });
            });
    } else {
        // Add without deleting the last card
        findOneAndUpdate(User(role), { res, _id, currCard, lastCard });
    }
};

exports.readHistoryList = async (req, res) => {
    const { _id, clientUserData } = req.profile;

    const { role } = await await req.getAccount(_id);

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
        User(role)
            .findOneAndUpdate(
                { _id },
                { $set: { "clientUserData.purchaseHistory": newHistoryData } },
                { new: false }
            )
            .exec((err, user) => {
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
    User(role)
        .findById(cliAdminId)
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
    const { _id, role, clientUserData } = req.profile;
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

    User(role)
        .findById(_id) // LESSON - do not use select with SAVE.
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
