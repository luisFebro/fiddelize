const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bizTeamData = {
    subRole: {
        type: String,
        default: "rep-vendas",
        enum: ["dev", "rep-vendas", "afiliado"],
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
