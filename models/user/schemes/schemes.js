// COMMON SCHEMES BETWEEN ROLES
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// NOTIFICATIONS
const enumTypes = [
    "welcome", // cliAdmin/cliUser
    "challenge", // cliAdmin
    "system", // cliAdmin/cliUser
    "chatRequest", // future implementations...
    "birthday", // cliAdmin/cliUser
    "pro", // cliAdmin
    "score", // cliUser
    // "newClientsToday", // cliAdmin (deactivated)
];

const enumSubtypes = [
    // CHALLENGES
    "clientWonChall", // cliAdmin
    "confirmedChall", // cliUser - sent after cli-admin confirm discounts scores
    // BIRTHDAYS
    "weeklyReport",
    "greeting",
    // SYSTEM
    "newFeature",
    "lowBalanceWarning", // e.g sms usage is about to end..
    "promotion",
    // PRO
    "welcomeProPay", // backend
    "proPay", // backend
    "proNearExpiryDate", // frontend
    "proExpiredDate", // frontend
    // SCORE
    "scorePlus", // backend
];

const notificationsData = {
    // recipient.id and senderId should be equal for all notifications from Fiddelize.
    // recipient: { id: String (REQUIRED), role: (REQUIRED){ type: String, enum: ["cliAdmin", "cliUser"]}, name: String }, // this object format is just to fetch data, then a fucntion will organize data in the shape of this schema
    cardType: { required: true, type: String, enum: [...enumTypes] }, // *
    subtype: { type: String, enum: [...enumSubtypes] }, // *
    content: { type: String }, // msgs for chat or infos about variable in such data format: key1:value1;key2:value2;
    senderId: String, // for authorization verification and for chat request
    senderName: {
        default: "fiddelize",
        type: String,
        trim: true,
        lowercase: true,
    }, // only for chat request
    isCardNew: { type: Boolean, default: true }, // When user visualize notif page, a new badge will be show and then it will be update as false
    clicked: { type: Boolean, default: false }, // user read the message or clicked on the action button. This will be used to display different design both for card which was read and that ones that did not
    isImportant: { type: Boolean }, // this will not be mark as read/clicked if user markAllAsRead
    createdAt: { type: Date, default: Date.now },
    updatedBy: {
        // useful to know if the notification was saw or updated to another person. Useful for a collaborative teamwork.
        name: String,
        updatedAt: Date,
    },
};

const NotificationsSchema = new Schema(notificationsData, { _id: true });
// END NOTIFICATIONS

const DefaultFilterSchema = {
    day: Number,
    week: String, // e.g w:31_6.m:9.y:2020 => startOfWeek_endOfWeek.startMonth.startYear
    month: String, // e.g m:9.y:2020 => month.year
    year: Number,
};

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
    ordersStatement: Object, // n1 e.g { amount: 4, price: 740 }
    transactionStatus: transStatusObj, // set in notification request
    paymentMethod: {
        type: String,
        enum: ["boleto", "cartão crédito", "débito bancário"],
    },
    paymentDetails: String, // boleto santander, nomes das bandeiras aqui...
    planDueDate: Date, // expiration date for the plan
    renewal: RenewalSchema,
    createdAt: { type: Date, default: Date.now }, // timestamps do not work for subdocuments on mondodb...
    updatedAt: { type: Date, default: Date.now },
    payDueDate: String, // only for boleto
    paymentLink: String, // for eft and boleto only
    barcode: String, // only for boleto
};
const OrdersSchema = new Schema(ordersData, { _id: true });
// END ORDERS

// where_what_description --- desc is optional
const onceCheckedData = {
    cliAdminDash_feature_proSearch: Boolean, // avoid declare default false to not declare unessary fields to DB.
    backend_accountPanel: Boolean,
};
const OnceCheckedSchema = new Schema(onceCheckedData, { _id: false });

module.exports = {
    NotificationsSchema,
    OnceCheckedSchema,
    DefaultFilterSchema,
    OrdersSchema,
};

/*

const ttlData = {
    requestId: String,
    ttlId: { type: Schema.Types.ObjectId, ref: "TTL" },
};
const TTLSchema = new Schema(ttlData, { _id: false });

 */

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
