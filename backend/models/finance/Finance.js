const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const collectionName = "finances";

const data = {
    statusCheck: {
        type: String,
        default: "pendente",
        lowercase: true,
        enum: ["pendente", "pago"]
    },
    paymentType: {
        type: String,
        default: "dinheiro",
        lowercase: true,
        enum: ["dinheiro", "débito", "crédito"]
    },
    installmentsIfCredit: {
        type: Number,
        default: 0
    },
    agentRole: {
        type: String,
        enum: ["colaborador", "admin"]
    },
    agentName: {
        type: String,
        lowercase: true,
    },
    clientName: {
        type: String,
        lowercase: true,
    },
    description: {
        type: String,
        lowercase: true,
    },
    service: String,
    cashInValue: {
        type: Number,
        default: 0,
    },
    cashOutValue: {
        type: Number,
        default: 0,
    },
    formattedDate: String,
}

const FinanceSchema = new Schema(data, { timestamps: true });
module.exports = mongoose.model('Finance', FinanceSchema, collectionName);
