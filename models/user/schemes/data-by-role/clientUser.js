const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;
const { NotificationsSchema, OnceCheckedSchema } = require("../schemes.js");

const historyData = {
    challengeN: Number,
    cardType: {
        type: String,
        default: "record",
        enum: ["prize", "record", "brief", "remainder"],
    },
    isLastRecordCard: Boolean, // for insert desc/score in the last record card dynamically...
    icon: String,
    desc: String,
    finishedScore: Number, // cardType: brief - the total of scores from a challenge after user has finished.
    createdAt: { type: Date, default: new Date() },
    value: { type: Number, default: 0 },
    // For "prize" cartType variables. both false as default but not explicit at start.
    isPrizeExpired: Boolean,
    isPrizeReceived: Boolean,
    isPrizeConfirmed: Boolean, // archive: default: function() { return this.cardType === "prize" ? false : undefined }},
    onceChecked: OnceCheckedSchema,
};
const HistorySchema = new Schema(historyData, { _id: true });

const tempScoreData = {
    tempScore: Number,
    createdAt: { type: Date, default: new Date() },
};
const TempScoreSchema = new Schema(tempScoreData, { _id: false });

const clientUserData = {
    bizId: { type: String, default: "0" },
    cashCurrScore: {
        // last score/purchase value
        type: String,
        default: "0",
    },
    currScore: {
        // last score + cashCurrenScore
        type: Number, // need to be number to ranking the values property.
        default: 0,
    },
    totalPurchasePrize: { type: Number, default: 0 },
    totalActiveScore: { type: Number, default: 0 }, // Same as currScore, only used on client history to differentiate from totalGeneralScore, active score is total of user's current challenge score.
    totalGeneralScore: { type: Number, default: 0 }, // it is the general accumative scoring from all challenges.
    totalVisits: { type: Number, default: 0 },
    purchaseHistory: [HistorySchema],
    notifications: [NotificationsSchema],
    filterBirthday: Number, // 23 de Agosto de 1994 => 823 (month code + day code)
    filterLastPurchase: Date,
    filterHighestPurchase: Number,
    registeredBy: { type: ObjectId, ref: "CliMember" }, // not applicable for admin, need to fetch from admin doc
    tempScoreList: [TempScoreSchema], // store scores from members app. The elements will delete after usage...
};

const ClientUserSchema = new Schema(clientUserData, { _id: false });
module.exports = ClientUserSchema;
