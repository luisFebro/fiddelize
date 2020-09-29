const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const collectionName = "orders";

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
    amount: {
        gross: String, // e.g 520.00
        net: String, // e.g 493.65
        fee: String, // e.g  26.35
        extra: String, // e.g 0.00 for discounts
    },
};

const orderSchema = new Schema(data, { timestamps: true });
module.exports = mongoose.model("Order", orderSchema, collectionName);
