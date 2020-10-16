const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const collectionName = "pricing";

const plansData = {
    price: {
        yearly: Number,
        monthly: Number,
    },
    credit: {
        // 888 for infinity credits.
        yearly: Number,
        monthly: Number,
    },
};

const data = {
    serviceName: String,
    gold: plansData,
    silver: plansData,
    bronze: plansData,
    isPackage: Boolean, // identify services which got a changeable pricing value and sold by package. e.g Novvos Clientes, Kit da Eqquipe
    // plansIncluded: { type: Array, default: ["gold", "silver", "bronze"] }, ssimplying using 0 in all excluded plan pricing when not included
};

const PricingSchema = new Schema(data, { _id: true, timestamps: false });

module.exports = mongoose.model("Pricing", PricingSchema, collectionName);
