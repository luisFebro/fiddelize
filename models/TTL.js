const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const collectionName = "TTL";
// TIME-TO-LIVE
/*
TTL indexes are special single-field indexes that MongoDB can use to automatically remove documents from a collection after a certain amount of time or at a specific clock time.
USEFUL FOR setting a expiry time for email tokens, user session, limit attempt of login etc
 */

const dataTTL = {
    target: { type: String, required: true, enum: ["emailToken"] },
    userId: String,
    expireAt: { type: Date, required: true },
    isExpired: { type: Boolean, default: false },
    requestId: String,
};

const TTLSchema = new Schema(dataTTL, { _id: true });
// TTL.index({ createdAt: 1 }, { expireAfterSeconds: '60m' }); // This does not fucking work. a self-made TTL system implemented
module.exports = mongoose.model("TTL", TTLSchema, collectionName);
