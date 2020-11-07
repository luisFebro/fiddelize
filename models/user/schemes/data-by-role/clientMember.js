const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { NotificationsSchema } = require("../schemes.js");

const clientMemberData = {
    bizId: { type: String, required: true },
    memberJob: String, // vendas, atendimento, caixa, gerência
    newClientTotal: { type: Number, default: 0 },
    newScoreTotal: { type: Number, default: 0 },
    // content: String,
    notifications: [NotificationsSchema],
};

const ClientMemberSchema = new Schema(clientMemberData, { _id: false });
module.exports = ClientMemberSchema;
