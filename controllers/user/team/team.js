const User = require("../../../models/user");
// const allSettled = require('promise.allsettled'); // Promise.allSettled only available for nodejs 12.19 and above. This shitty version need this lib for now.
const {
    getDataChunk,
    getChunksTotal,
} = require("../../../utils/array/getDataChunk");
const { sendBackendNotification } = require("../../notification");
const { getMemberTaskList } = require("./helpers");
const sortDates = require("../../../utils/dates/sortDates");

const getPushFifo = (field, elem) => {
    const fifo = { $each: [elem], $position: 0 }; // first in, first out.
    const finalFifo = { [field]: fifo };

    return { $push: finalFifo };
};

// POST
exports.setTempScoreAndMemberData = async (req, res) => {
    const {
        needClientIdOnly,
        bizId,
        clientId,
        clientName,
        memberId,
        tempScore,
    } = req.body;

    if (needClientIdOnly) {
        const nameQuery = { name: clientName };
        const bizQuery = { "clientUserData.bizId": bizId };
        const query = { $and: [nameQuery, bizQuery] };

        const { _id } = await User("cliente").findOne(query).select("_id");

        return res.json(_id);
    }

    const sendTempUserScore = async () => {
        const pushList = getPushFifo("clientUserData.tempScoreList", {
            tempScore,
            used: false,
        });
        // set score to a temporary variable in user doc on DB (OK)
        return await User("cliente")
            .findByIdAndUpdate(clientId, pushList)
            .catch((err) => {
                error: "Um erro ocorreu ao atualizar cliente.";
            });
    };

    const notifData = {
        cardType: "score",
        subtype: "scorePlus",
        recipient: { role: "cliente", id: clientId },
        content: `tempScore:${tempScore};`,
    };

    // send notification to cli-user about score (OK)
    const sendUserNotif = async () => {
        return await sendBackendNotification({ notifData }).catch((err) => {
            error: "Um erro ocorreu ao atualizar cliente.";
        });
    };

    // n1. Promise.all fail-fast behavior - even if the last promise is the rejected, all other won't revolse
    // Promise.race The Promise.race() method returns a promise that fulfills or rejects as soon as one of the promises in an iterable fulfills or rejects, with the value or reason from that promise.
    const userPromises = await Promise.race([
        sendTempUserScore(),
        sendUserNotif(),
    ]).catch((err) => {
        res.status(500).json(err);
    });

    const isFromAdmin = Boolean(bizId === memberId);
    const targetCli = isFromAdmin ? "cliente-admin" : "cliente-membro";
    if (userPromises) {
        // set member data and transaction history
        const memberData = await User(targetCli)
            .findById(memberId)
            .select("clientMemberData.newScoreTotal -_id");

        const priorAddedScores =
            memberData && memberData.clientMemberData
                ? memberData.clientMemberData.newScoreTotal
                : 0;

        const taskData = {
            memberTask: "newScore",
            clientName: clientName && clientName.toLowerCase(),
            clientScore: tempScore,
        };

        const pushList = getPushFifo("clientMemberData.taskList", taskData);

        await User(targetCli).findByIdAndUpdate(memberId, {
            "clientMemberData.newScoreTotal": priorAddedScores + tempScore,
            ...pushList,
        });

        res.json({ msg: "all temp score and member data set" });
    }
};

// exclusive for new clients registration,
// since newScores addition is embedded on setTempScoreAndMemberData above
// This is that to avoid a new DB search.
exports.addMemberTaskHistory = async ({
    clientName,
    tempScore, // tempScore is here because cliUsers can be registed with an entry amount of fidelity scores.
    memberRole,
    memberId,
}) => {
    const taskData = {
        memberTask: "newClient",
        clientName: clientName && clientName.toLowerCase(),
        clientScore: tempScore || 0,
    };

    const pushList = getPushFifo("clientMemberData.taskList", taskData);

    const targetCli =
        memberRole === "cliente-admin" ? "cliente-admin" : "cliente-membro";

    const countClientTotal = { "clientMemberData.newClientTotal": 1 };

    await User(targetCli).findByIdAndUpdate(memberId, {
        $inc: countClientTotal,
        ...pushList,
    });
};

/* GOAL RETURN THIS:
clientName: "Augusta Silva",
clientScore: 250, // Cadastrou com pontos: 250 (OK)
memberTask: "newClient", (OK)
memberName: "Adriana Oliveira da Silva", (OK)
job: "vendas", (OK)
content: "", (OK NOT NEED FOR NOW)
createdAt: new Date(),
 */
exports.readTeamTasksList = async (req, res) => {
    const { bizId, skip, limit = 10, filterBy = "today" } = req.query;

    const validFilter = ["today", "all"];
    if (!validFilter.includes(filterBy))
        return res.status(400).json({
            error: "invalid filterBy value. Valid values: " + validFilter,
        });

    const adminDoc = await User("cliente-admin")
        .findById(bizId)
        .select("-_id name clientMemberData.taskList");

    const adminMemberData = {
        memberName: adminDoc.name.cap(),
        job: "admin",
    };

    const adminTaskList = getMemberTaskList({
        commonData: adminMemberData,
        memberData: adminDoc.clientMemberData,
        filterBy,
    });

    const memberDoc = await User("cliente-membro")
        .find({ "clientMemberData.bizId": bizId })
        .select("-_id name clientMemberData.job clientMemberData.taskList");

    const membersTaskList = getMemberTaskList({
        isMember: true,
        memberData: memberDoc,
        filterBy,
    });

    const allData = [...adminTaskList, ...membersTaskList];

    const data = sortDates(allData, { target: "createdAt", sortBy: "latest" });

    const dataSize = data.length;
    const dataRes = {
        list: getDataChunk(data, { skip, limit }),
        chunksTotal: getChunksTotal(dataSize, limit),
        listTotal: dataSize,
        content: undefined,
    };

    res.json(dataRes);
};

exports.readOneMemberTasksList = async (req, res) => {
    const { memberId, bizId, skip, limit = 10, filterBy = "today" } = req.query;

    const memberDoc = await User("cliente-membro")
        .find({ _id: memberId, "clientMemberData.bizId": bizId })
        .select("-_id name clientMemberData.job clientMemberData.taskList");

    const membersTaskList = getMemberTaskList({
        isMember: true,
        memberData: memberDoc,
        filterBy,
    });

    const data = membersTaskList;

    const dataSize = data.length;
    const dataRes = {
        list: getDataChunk(data, { skip, limit }),
        chunksTotal: getChunksTotal(dataSize, limit),
        listTotal: dataSize,
        content: undefined,
    };

    res.json(dataRes);
};

exports.readTeamMemberList = async (req, res) => {
    const { bizId, skip, limit = 5 } = req.query;

    const adminDoc = await User("cliente-admin")
        .findById(bizId)
        .select(
            "-_id name createdAt clientMemberData.newClientTotal clientMemberData.newScoreTotal"
        );

    const gotAdminMemberData = Boolean(adminDoc.clientMemberData);
    const adminMemberData = {
        name: adminDoc.name,
        job: "admin",
        createdAt: adminDoc.createdAt,
        newClientTotal: !gotAdminMemberData
            ? 0
            : adminDoc.clientMemberData.newClientTotal,
        newScoreTotal: !gotAdminMemberData
            ? 0
            : adminDoc.clientMemberData.newScoreTotal,
    };

    const memberDocs = await User("cliente-membro")
        .find({ "clientMemberData.bizId": bizId })
        .select(
            "_id name createdAt clientMemberData.newClientTotal clientMemberData.newScoreTotal"
        );

    const membersList = memberDocs.map((m) => {
        return {
            _id: m._id, // to be able to check member's profile...
            name: m.name,
            job: m.clientMemberData.job || "vendas",
            createdAt: m.createdAt,
            newClientTotal: m.clientMemberData.newClientTotal || 0,
            newScoreTotal: m.clientMemberData.newScoreTotal || 0,
        };
    });

    const data = [adminMemberData, ...membersList];

    const dataSize = data.length;
    const dataRes = {
        list: getDataChunk(data, { skip, limit }),
        chunksTotal: getChunksTotal(dataSize, limit),
        listTotal: dataSize,
        content: undefined,
    };

    res.json(dataRes);
};

exports.getMembersPodium = async (req, res) => {
    const {
        bizId,
        filterBy = "register", // or score
    } = req.query;

    let filterQuery;
    if (filterBy === "register") filterQuery = "newClientTotal";
    if (filterBy === "score") filterQuery = "newScoreTotal";

    const data = await User("cliente-membro")
        .find({ "clientMemberData.bizId": bizId })
        .select(`name clientMemberData.${filterQuery} -_id`)
        .sort({ [`clientMemberData.${filterQuery}`]: -1 })
        .limit(3);

    if (data.length) {
        const rankingList = data.map((member) => {
            const { name, clientMemberData } = member;
            const value = clientMemberData[filterQuery];
            return { name, value };
        });

        return res.json(rankingList);
    }

    res.json([]);
};

/* COMMENTS
n1: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
Promise.all fail-fast behaviour
Promise.all is rejected if any of the elements are rejected. For example, if you pass in four promises that resolve after a timeout and one promise that rejects immediately, then Promise.all will reject immediately.
*/
