const User = require("../../../models/user");
// const allSettled = require('promise.allsettled'); // Promise.allSettled only available for nodejs 12.19 and above. This shitty version need this lib for now.
const {
    getDataChunk,
    getChunksTotal,
} = require("../../../utils/array/getDataChunk");
const { sendBackendNotification } = require("../../notification");

const getPushFifo = (field, elem) => {
    const fifo = { $each: [elem], $position: 0 }; // first in, first out.
    const finalFifo = { [field]: fifo };

    return { $push: finalFifo };
};

// POST
exports.setTempScoreAndMemberData = async (req, res) => {
    const { clientId, clientName, memberId, tempScore } = req.body;

    const sendTempUserScore = async () => {
        const pushList = getPushFifo("clientUserData.tempScoreList", {
            tempScore,
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

    if (userPromises) {
        // set member data and transaction history
        const memberData = await User("cliente-membro")
            .findById(memberId)
            .select("clientMemberData.newScoreTotal -_id");

        const priorAddedScores = memberData.clientMemberData.newScoreTotal || 0;

        const countClientTotal = { "clientMemberData.newClientTotal": 1 };

        const taskData = {
            memberTask: "newScore",
            clientName,
            clientScore: tempScore,
        };

        const pushList = getPushFifo("clientMemberData.taskList", taskData);

        await User("cliente-membro").findByIdAndUpdate(memberId, {
            $inc: countClientTotal,
            "clientMemberData.newScoreTotal": priorAddedScores + tempScore,
            ...pushList,
        });

        res.json({ msg: "all temp score and member data set" });
    }
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
            "-_id name createdAt clientMemberData.newClientTotal clientMemberData.newScoreTotal"
        );

    const membersList = memberDocs.map((m) => {
        return {
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

/* COMMENTS
n1: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
Promise.all fail-fast behaviour
Promise.all is rejected if any of the elements are rejected. For example, if you pass in four promises that resolve after a timeout and one promise that rejects immediately, then Promise.all will reject immediately.
*/
