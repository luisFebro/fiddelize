const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
};

const BizTeamSchema = new Schema(bizTeamData, { _id: false });
module.exports = BizTeamSchema;
