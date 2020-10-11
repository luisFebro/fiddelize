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
    // plansIncluded: { type: Array, default: ["gold", "silver", "bronze"] }, ssimplying using 0 in all excluded plan pricing when not included
};

const PricingSchema = new Schema(data, { _id: true, timestamps: false });

module.exports = mongoose.model("Pricing", PricingSchema, collectionName);
