const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { OnceCheckedSchema } = require("../schemes.js");

const bizTeamData = {
    job: {
        type: String,
        default: "afiliado",
        enum: ["dev", "rep-comercial", "afiliado"], // business representative
    },
    payments: {
        grossIncome: Number,
        liquidIncome: Number,
        transitionTax: Number,
    },
    sales: Number, // under construction...
    onceChecked: OnceCheckedSchema,
    primaryAgent: String, // agent who invited the current new agent. e.g fiddelize => rep // rep => affiliates
    uniqueLinkId: String, // unique id for the registered agent
    publicKey: String, // publicKey is provided by a notification from Pagseguro. this allow payment split
    redirectAuthCode: String, // agents will be redirect with this code like: `https://pagseguro.uol.com.br/v2/authorization/request.jhtml?code=${authCode}`
};

const BizTeamSchema = new Schema(bizTeamData, { _id: false });
module.exports = BizTeamSchema;
