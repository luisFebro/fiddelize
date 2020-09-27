const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const collectionName = "orders";

/* STATUS
1 - Aguardando Investimento,
2 - Em análise,
3 - Pago,
4 - Disponível,
5 - Em Disputa,
*/

const data = {
    agentName: String, // for future salesperson id
    agentId: String,
    clientAdmin: {
        name: String,
        id: String,
    },
    transaction: {
        code: String,
        status: { type: Number, default: 1, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9] }, // VEJA STATUS ACIMA
    },
    paymentMethod: String,
    reference: String,
    amount: {
        gross: String, // e.g 520.00
        net: String, // e.g 493.65
        fee: String, // e.g  26.35
        extra: String, // e.g 0.00 for discounts
    },
    headers: Object, // test pagseguro notification only!!!
};

const orderSchema = new Schema(data, { timestamps: true });
module.exports = mongoose.model("Order", orderSchema, collectionName);
