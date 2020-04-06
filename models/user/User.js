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

// USER'S ROLES
// Client User
// Client Admin
const historyData = {
    challengeN: {type: Number, default: 1},
    icon: String,
    desc: String,
    createdAt: {type: Date, default: new Date()},
    value: Number,
    cardType: { type: String, default: "record",  enum: ["prize", "record"]},
    // For "prize" cartType variables. both false as default but not explicit at start.
    isPrizeReceived: Boolean,
    isPrizeConfirmed: Boolean,
}
const HistorySchema = new Schema(historyData, { _id: false, timestamps: false });

const purchaseData = {
    history: [HistorySchema],
}
const PurchaseSchema = new Schema(purchaseData, { _id: false, timestamps: true });

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
    purchase: PurchaseSchema,
}
const ClientUserDataSchema = new Schema(clientUserData, { _id: false });

// Client Admin
const regulationData = {
    text: {
        type: String,
        trim: true,
    },
    updatedAt: Date
}
const RegulationSchema = new Schema(regulationData, { _id: false }); // timestamps: true is not working here

const planCodesData = {
    bronze: String, // self-service functionalities - 3 options
    silver: String,
    gold: String,
}
const PaidPlanCodesSchema = new Schema(planCodesData, { _id: false });

// where_what_description
const onceActionsData = {
    cliAdminDash_feature_proSearch: { type: Boolean, default: false },
}
const OnceActionsSchema = new Schema(onceActionsData, { _id: false });

const clientAdminData = {
    bizName: String, // required: true,comment out cuz every sign up will request and throw error
    bizCodeName: String,
    bizCnpj: String, // NOT IMPLEMENTED YET
    bizWhatsapp: Number,
    bizPlan: {
        type: String,
        default: "gratis",
        enum: ["gratis", "prata", "ouro"]
    },
    bizPlanCode: PaidPlanCodesSchema,
    bizPlanStarts: Date, // NOT IMPLEMENTED YET
    bizPlanExpires: Date, // NOT IMPLEMENTED YET
    bizCep: Number, // NOT IMPLEMENTED YET

    // self-service
    bizLogoImg: String,
    milestoneIcon: String,
    themePColor: String,
    themeSColor: String,
    // end self-service

    totalUsersScore: Number, // NOT IMPLEMENTED YET
    totalUsers: Number, // NOT IMPLEMENTED YET

    rewardScore: Number, // prior maxScore
    mainReward: String,
    rewardList: Array, // / required: true


    verificationPass: String,
    regulation: RegulationSchema,

    appDownloads: { type: Number, default: 0 },
    onceActions: OnceActionsSchema, // NOT IMPLEMENTED YET
}
const ClientAdminDataSchema = new Schema(clientAdminData, { _id: false });
ClientAdminDataSchema.pre('save', function(next) {
    this.bizPlanCode = generatePlanCodes();
    next();
});

// Client Admin
const adminData = {
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
const AdminDataSchema = new Schema(adminData, { _id: false });
// END USER'S ROLES

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
    msgReadByUser: {
        staffRequired: {
            type: Boolean,
            default: false,
        },
    },
    clientUserData: ClientUserDataSchema,
    clientAdminData: ClientAdminDataSchema,
    adminData: AdminDataSchema,
    // staffBookingList: Array, // L
}

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