const User = require("../../../models/user");
const {
    getDataChunk,
    getChunksTotal,
} = require("../../../utils/array/getDataChunk");

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
