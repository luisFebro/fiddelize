const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { NotificationsSchema } = require("../schemes.js");

const clientMemberData = {
    memberJob: String, // Vendas, Atendimento, Caixa, Divulgação
    newClientTotal: { type: Number, default: 0 },
    newScoreTotal: { type: Number, default: 0 },
    notifications: [NotificationsSchema],
};

const ClientMemberSchema = new Schema(clientMemberData, { _id: false });
module.exports = ClientMemberSchema;
