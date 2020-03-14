const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const collectionName = "all-users";

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

// LOYALTY SCORES- this will be moved to client
const dataLoyaltyScores = {
    cashCurrentScore: {
        type: String,
        default: "0"
    },
    currentScore: {
        type: Number,
        default: 0
    },
    lastScore: {
        type: String,
        default: "0"
    },
    maxScore: {
        type: Number,
        default: 500,
    }
}

const LoyaltyScoresSchema = new Schema(dataLoyaltyScores, { _id: false });
// END LOYALTY SCORES

// USER'S ROLES
// Client User
const clientUserData = {
    cashCurrentScore: {
        type: String,
        default: "0"
    },
    currentScore: { // last score + cashCurrenScore
        type: Number, // need to be number to ranking the values property.
        default: 0
    },
    lastScore: { // backup purpose.
        type: String,
        default: "0"
    },
    maxScore: { // this will change to client-admin reward: score
        type: Number,
        default: 500,
    },
    scoreHistoricDesc: String,
    scoreHistoricValue: Number,
}
const ClientUserDataSchema = new Schema(clientUserData, { _id: false });

// Client Admin
const regulationData = {
    text: {
        type: String,
        trim: true,
    }
}
const RegulationSchema = new Schema(regulationData, { _id: false, timestamps: true });

const clientAdminData = {
    bizName: String, // required: true,comment out cuz every sign up will request and throw error
    bizCodeName: String,
    bizCnpj: String,
    bizWhatsapp: Number,
    bizLogoImg: String,

    rewardScore: Number, // prior maxScore
    mainReward: String,
    rewardList: Array, // / required: true

    themePColor: String,
    themeSColor: String,

    verificationPass: String,
    regulation: RegulationSchema,
    appDownloads: { type: Number, default: 0 },
    // onceActionSetPassword: { type: Boolean, default: false },
}
const ClientAdminDataSchema = new Schema(clientAdminData, { _id: false });

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
    loyaltyScores: LoyaltyScoresSchema, // this will be moved to clientUserData...
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