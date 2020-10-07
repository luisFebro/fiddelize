const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DefaultFilterSchema = {
    day: Number,
    week: String, // e.g w:31_6.m:9.y:2020 => startOfWeek_endOfWeek.startMonth.startYear
    month: String, // e.g m:9.y:2020 => month.year
    year: Number,
};

// SMS
const contactListData = {
    id: String,
    name: String,
    phone: String, //"(92) 99281-7363",
    carrier: String, // operadora: oi, claro, tim, vivo, nextel
    // This will handled in frontend status: { type: String,  enum: ["recebido", "enviando", "agendado", "falhou"]}
};
const ContactListSchema = new Schema(contactListData, { _id: false });

const smsHistoryData = {
    cardType: { type: String, default: "out", enum: ["out", "in"] },
    sentMsgDesc: String, // description of the msg sent in this batch
    totalSMS: Number, // length of contact list
    firstContacts: Array, // the first 3 names from easy identification.
    contactStatements: [ContactListSchema],
    scheduledDate: Date,
    isScheduled: Boolean,
    isCanceled: Boolean,
    isAutomatic: Boolean,
    createdAt: { type: Date, default: Date.now },
    filter: DefaultFilterSchema,
};
const SmsHistorySchema = new Schema(smsHistoryData, { _id: true });

const smsAutomationData = {
    serviceId: Number,
    service: {
        type: String,
        enum: ["missingPurchase", "confirmedChall", "finishedChall"],
    },
    active: Boolean,
    usage: { type: Number, default: 0 },
    msg: String,
    afterDay: Number,
};
const SmsAutomationSchema = new Schema(smsAutomationData, { _id: false });
// END SMS

// ORDERS
const transStatusObj = {
    type: String,
    enum: [
        "pendente",
        "em análise",
        "pago",
        "disponível",
        "em disputa",
        "devolvido",
        "cancelado",
        "debitado",
        "em retenção",
    ],
};

const renewalData = {
    priorRef: String,
    priorDaysLeft: Number,
    currRef: String,
    totalRenewalDays: Number,
    isPaid: Boolean, // only when paid on transaction
    isOldCard: Boolean, // identify the last card and expire it on finish checkout since we create another card with a new usage's time.
};
const RenewalSchema = new Schema(renewalData, { _id: false });

const ordersData = {
    reference: String,
    investAmount: String,
    ordersStatement: Object, // n1 e.g
    barcode: String,
    transactionStatus: transStatusObj,
    paymentLink: String,
    paymentCategory: { type: String, enum: ["boleto", "crédito", "débito"] },
    paymentMethod: String, // boleto santander, nomes das bandeiras aqui...
    payDueDate: String,
    planDueDate: Date,
    renewal: RenewalSchema,
    createdAt: { type: Date, default: Date.now }, // timestamps do not work for subdocuments on mondodb...
    updatedAt: { type: Date, default: Date.now },
};
const OrdersSchema = new Schema(ordersData, { _id: true });
// END ORDERS

// BIZ PLAN
const bizPlanListData = {
    plan: { type: String, enum: ["ouro", "prata", "bronze"] },
    service: {
        type: String,
        enum: [
            "Novvos Clientes",
            "Envvio Whatsapp",
            "Orgganize Clientes",
            "Prêmmios Clientes",
        ],
    }, // funcName_local
    creditStart: { type: Number, default: 10 }, // base to calculate the creditEnd. Minimum value is from the value of free register.
    creditEnd: Number, // max limit
    usageTimeEnd: Date,
    history: Array, // record cred, period, value, date
    periodicity: { type: String, enum: ["monthly", "yearly"] }, // monthly or yearly
};
const BizPlanListSchema = new Schema(bizPlanListData, { _id: true });
// END BIZ PLAN

module.exports = {
    SmsHistorySchema,
    SmsAutomationSchema,
    // PendingRegistersSchema,
    DefaultFilterSchema,
    OrdersSchema,
    BizPlanListSchema,
};

// CLIENTS HISTORY
// const pendingRegistersData = {
//     clientName: { type: String, trim: true },
//     registeredBy: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now },
// };
// const PendingRegistersSchema = new Schema(smsAutomationData, { _id: true });
// END CLIENTS HISTORY
/*
n1
Object of objects.
{
    Coppia Segurança: {amount: 1, price: 24.5, isPreSale: 24.5}
    currPlan: {amount: 5, price: 520}
    sms: {totalPackage: 24, amount: 4800, price: 576, removeCurr: false}
}
 */
