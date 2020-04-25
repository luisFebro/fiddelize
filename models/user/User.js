const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const collectionName = "all-clients";
const generatePlanCodes = require("../../utils/string/generateAlphaNumeric");

// TEMP AUTH USER ID
const dataTempAuthUserToken = {
    this: {
        type: String,
        default: '',
    },
    createdAt: { type: Date, default: Date.now, expires: '1m' }
}

const UserTokenSchema = new Schema(dataTempAuthUserToken);
// END TEMP AUTH USER ID
// GENERAL SCHEMAS
const enumCliAdmin = ["cliAdmin_birthday", "cliAdmin_newClients", "cliAdmin_clientWonChall"];
const notificationsData = {
    type: { type: String, enum: [...enumCliAdmin] }, // pattern: (role_desc);
    sent: { type: Boolean, default: false },
    checked: { type: Boolean, default: false },
    createdAt: { type: Date, default: new Date() },
}
const NotificationsSchema = new Schema(notificationsData, { _id: false });
// END GENERAL SCHEMAS

// USER'S ROLES
// Client-User
const historyData = {
    challengeN: Number,
    cardType: { type: String, default: "record",  enum: ["prize", "record"]},
    icon: String,
    desc: String,
    createdAt: {type: Date, default: new Date()},
    value: { type: Number, default: 0 },
    // For "prize" cartType variables. both false as default but not explicit at start.
    isPrizeReceived: Boolean,
    isPrizeConfirmed: Boolean, // archive: default: function() { return this.cardType === "prize" ? false : undefined }},
}
const HistorySchema = new Schema(historyData, { _id: true });

const clientUserData = {
    bizId: { type: String, default: "0"},
    cashCurrScore: {
        type: String,
        default: "0"
    },
    currScore: { // last score + cashCurrenScore
        type: Number, // need to be number to ranking the values property.
        default: 0
    },
    lastScore: { // backup purpose.
        type: String,
        default: "0"
    },
    totalPurchasePrize: { type: Number, default: 0 },
    totalGeneralScore: { type: Number, default: 0 },
    totalVisits: { type: Number, default: 0 },
    purchaseHistory: [HistorySchema],
}
const ClientUserDataSchema = new Schema(clientUserData, { _id: false });
// End Client-User

// Client Admin
const regulationData = {
    text: {
        type: String,
        trim: true,
    },
    updatedAt: Date
}
const RegulationSchema = new Schema(regulationData, { _id: false }); // timestamps: true does  not work as a subdocument

const planCodesData = {
    bronze: String, // self-service functionalities - 3 options
    silver: String,
    gold: String,
}
const PaidPlanCodesSchema = new Schema(planCodesData, { _id: false });

// where_what_description
const onceCheckedData = {
    cliAdminDash_feature_proSearch: Boolean, // avoid declare default false to not declare unessary fields to DB.
}
const OnceCheckedSchema = new Schema(onceCheckedData, { _id: false });

const clientAdminData = {
    bizName: String, // required: true,comment out cuz every sign up will request and throw error
    bizCodeName: String,
    bizCnpj: String, // NOT IMPLEMENTED YET
    bizWhatsapp: String,

    // premium plans
    bizPlan: {
        type: String,
        default: "gratis",
        enum: ["gratis", "bronze", "prata", "ouro"]
    },
    bizPlanCode: PaidPlanCodesSchema,
    bizPlanStarts: Date, // NOT IMPLEMENTED YET
    bizPlanExpires: Date, // NOT IMPLEMENTED YET
    // end premium plans

    // address
    bizCep: Number, // NOT IMPLEMENTED YET
    bizAddress: Number, // NOT IMPLEMENTED YET
    // end address

    // self-service
    selfBizLogoImg: String,
    selfMilestoneIcon: String,
    selfThemePColor: String,
    selfThemeSColor: String,
    // end self-service

    totalClientUserScores: Number,
    totalClientUsers: Number,

    rewardScore: Number, // prior maxScore
    rewardDeadline: { type: Number, default: 30 },
    mainReward: String,
    rewardList: Array, // NOT IMPLEMENTED

    verificationPass: String,
    regulation: RegulationSchema,

    onceChecked: OnceCheckedSchema, // NOT IMPLEMENTED YET
    notifications: [NotificationsSchema], // NOT IMPLEMENTED YET
}
const ClientAdminDataSchema = new Schema(clientAdminData, { _id: false });
ClientAdminDataSchema.pre('save', function(next) {
    this.bizPlanCode = generatePlanCodes();
    next();
});
// End Client Admin

// Central Admin
const centralAdminData = {
    subRole: {
        type: String,
        default: "rep-vendas",
        enum: ["dev", "rep-vendas", "ops-vendas"]
    },
    payments: {
        grossIncome: Number,
        liquidIncome: Number,
        transitionTax: Number,
    },
}
const CentralAdminDataSchema = new Schema(centralAdminData, { _id: false });
// End Central Admin
// END USER'S ROLES

// Profile
const data = {
    role: {
        type: String,
        default: "cliente-admin",
        enum: ["admin", "cliente-admin", "cliente"]
    },
    name: {
        type: String,
        trim: true,
        maxlength: 40,
        required: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    cpf:{
        type: String,
        unique: true,
    },
    phone: {
        type: String,
    },
    birthday: {
        type: String,
    },
    maritalStatus: {
        type: String,
        default: "Não selecionado"
    },
    clientUserData: ClientUserDataSchema,
    clientAdminData: ClientAdminDataSchema,
    centralAdminData: CentralAdminDataSchema,
    // staffBookingList: Array, // L
}
// End Profile

const UserSchema = new Schema(data, { timestamps: true });
module.exports = mongoose.model('User', UserSchema, collectionName);

/* COMMENTS
n1: LESSON: JSON does not accept numbers which starts with 0
L: LESSON: if you need get the length of the arrays to sort them, just reference the field's array themselves.array
It does not need to write a new field with length:
staffBookingsSize: {
        type: Number,
        default: function() {
            return this.staffBookingList.length`;
        }
    },
By the way, this field will not be sorted at all
This is how I sorted by the largest length of items, and then sorted by name:
.sort({ staffBookingList: 1, name: 1 })
*/


/* ARCHIVES
UserSchema.pre('findOneAndUpdate', async function(next) {
    const doc = await this.model.findOne(this.getQuery());

    next();
});
 */