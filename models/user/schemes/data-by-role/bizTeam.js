const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { OnceCheckedSchema } = require("../schemes.js");

const bizTeamData = {
    job: {
        type: String,
        default: "associado",
        enum: ["dev", "rep-comercial", "associado"],
    },
    payments: {
        grossIncome: Number,
        liquidIncome: Number,
        transitionTax: Number,
    },
    sales: Number, // under construction...
    onceChecked: OnceCheckedSchema,
};

const BizTeamSchema = new Schema(bizTeamData, { _id: false });
module.exports = BizTeamSchema;
