const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// SMS
const contactListData = {
    id: String,
    name: String,
    phone: String, //"(92) 99281-7363",
    carrier: String, // operadora: oi, claro, tim, vivo, nextel
    // This will handled in frontend status: { type: String,  enum: ["recebido", "enviando", "agendado", "falhou"]}
}
const ContactListSchema = new Schema(contactListData, { _id: false });

const smsHistoryData = {
    cardType: { type: String, default: "out",  enum: ["out", "in"]},
    sentMsgDesc: String, // description of the msg sent in this batch
    totalSMS: Number, // length of contact list
    firstContacts: Array, // the first 3 names from easy identification.
    contactStatements: [ContactListSchema],
    scheduledDate: Date,
    isCanceled: Boolean,
    createdAt: { type: Date, default: Date.now },
}
const SmsHistorySchema = new Schema(smsHistoryData, { _id: true });

const smsAutomationData = {
    service: { type: String, enum: ["missingPurchase", "confirmedChall"] },
    active: Boolean,
    usage: { type: Number, default: 0 },
    msg: String,
    afterDay: Number,
}
const SmsAutomationSchema = new Schema(smsAutomationData, { _id: true });
// END SMS

module.exports = { SmsHistorySchema, SmsAutomationSchema };