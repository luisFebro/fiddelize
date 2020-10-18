// TIME-TO-LIVE
/*
TTL indexes are special single-field indexes that MongoDB can use to automatically remove documents from a collection after a certain amount of time or at a specific clock time.
USEFUL FOR setting a expiry time for email tokens, user session, etc
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const collectionName = "ttl";

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
    target: { type: String, enum: ["email"] },
};

const ExpirySchema = new Schema(data, { _id: true, timestamps: true });
PricingSchema.index({ expireAfterSeconds: "1m" }); // set '1h' for email...
module.exports = mongoose.model("Pricing", PricingSchema, collectionName);
