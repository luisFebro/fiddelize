const User = require("../../../models/user/User");
const {
    getDataChunk,
    getChunksTotal,
} = require("../../../utils/array/getDataChunk");

const readTransactionHistory = (req, res) => {
    const { userId, skip, limit = 10 } = req.query;

    User("cliente-admin")
        .findById(userId)
        .select("clientAdminData.orders")
        .exec((err, user) => {
            if (err || !user)
                return res.status(400).json({ error: "Orders not found" });

            const data = user.clientAdminData.orders;

            const dataSize = data.length;
            const dataRes = {
                list: getDataChunk(data, { skip, limit }),
                chunksTotal: getChunksTotal(dataSize, limit),
                listTotal: dataSize,
                content: undefined,
            };

            res.json(dataRes);
        });
};

module.exports = readTransactionHistory;
