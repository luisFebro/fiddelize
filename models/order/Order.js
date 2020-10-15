const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const collectionName = "orders";

const { DefaultFilterSchema } = require("../user/schemes");

const data = {
    reference: String,
    agentName: String, // for future salesperson id
    agentId: String,
    clientAdmin: {
        name: String,
        id: String,
    },
    transactionStatus: {
        type: String,
        enum: [
            "pendente",
            "em análise",
            "pago",
            "disponível",
            "em disputa",
            "devolvido",
            "cancelado",
            "debitado",
            "em retenção",
        ],
    },
    paymentCategory: { type: String, enum: ["boleto", "crédito", "débito"] },
    paymentMethod: String, // boleto santander, nomes das bandeiras aqui...
    paymentReleaseDate: Date, // 15 or 30 days after purchasing date.
    amount: {
        gross: String, // e.g 520.00
        net: String, // e.g 493.65
        fee: String, // e.g  26.35
        extra: String, // e.g 0.00 for discounts
    },
    filter: DefaultFilterSchema,
    planDueDate: Date,
    isCurrRenewal: Boolean, // identify if transaction is renewal on transaction.
    totalRenewalDays: Number, // includes the prior plan usage time if any, too. give the correct quantity of usage time for renewal
    isSingleRenewal: Boolean, // identify a single service transaction like a Novvos Clientes package.
};

const orderSchema = new Schema(data, { timestamps: true });
module.exports = mongoose.model("Order", orderSchema, collectionName);
