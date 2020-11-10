const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { NotificationsSchema, OnceCheckedSchema } = require("../schemes.js");

const clientMemberData = {
    bizId: { type: String },
    job: {
        type: String,
        default: "vendas",
        enum: ["vendas", "atendimento", "caixa", "gerência", "admin"],
    },
    newClientTotal: { type: Number, default: 0 },
    newScoreTotal: { type: Number, default: 0 },
    // content: String,
    notifications: [NotificationsSchema],
    onceChecked: OnceCheckedSchema,
};

const ClientMemberSchema = new Schema(clientMemberData, { _id: false });
module.exports = ClientMemberSchema;
