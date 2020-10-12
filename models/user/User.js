const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const collectionName = "all-clients";
// const generatePlanCodes = require("../../utils/string/generateAlphaNumeric");

const {
    SmsHistorySchema,
    SmsAutomationSchema,
    // PendingRegistersSchema,
    DefaultFilterSchema,
    OrdersSchema,
    BizPlanListSchema,
} = require("./schemes");

// GENERAL SCHEMAS
const enumTypes = [
    // pattern: (role_desc);
    "welcome", // cliAdmin/cliUser
    "challenge", // cliAdmin
    "system", // cliAdmin/cliUser
    "chatRequest", // future implementations...
    "birthday", // cliAdmin/cliUser
    "pro",
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
};
const NotificationsSchema = new Schema(notificationsData, { _id: true });
// END GENERAL SCHEMAS

// USER'S ROLES
// Client-User
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
};
const HistorySchema = new Schema(historyData, { _id: true });

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
};
const ClientUserDataSchema = new Schema(clientUserData, { _id: false });
// End Client-User

// Client Admin
const regulationData = {
    text: {
        type: String,
        trim: true,
    },
    updatedAt: Date,
};
const RegulationSchema = new Schema(regulationData, { _id: false }); // timestamps: true does  not work as a subdocument

// where_what_description
const onceCheckedData = {
    cliAdminDash_feature_proSearch: Boolean, // avoid declare default false to not declare unessary fields to DB.
};
const OnceCheckedSchema = new Schema(onceCheckedData, { _id: false });

const rewardListData = {
    id: String,
    icon: String,
    rewardScore: Number,
    rewardDesc: String,
};
const RewardListSchema = new Schema(rewardListData, { _id: false });

const tasksListData = {
    // or to do list
    done: { type: Boolean, default: false },
    taskType: {
        type: String,
        default: "pendingDelivery",
        enum: ["pendingDelivery"],
    },
    taskTitle: String,
    content: String, // e.g dataFormat: "cliUserId:123;cliUserName:febro;prizeDesc:tickets;challNum:2;deadline:30/12/20;"
    madeDate: Date,
    madeBy: String,
    createdAt: { type: Date, default: Date.now },
};
const TasksListSchema = new Schema(tasksListData, { _id: true });

const clientAdminData = {
    bizName: String, // required: true,comment out cuz every sign up will request and throw error
    bizCodeName: String,
    bizCnpj: String, // NOT IMPLEMENTED YET
    bizWhatsapp: String,

    // premium plans
    bizFreeCredits: {
        NovvosClientes: { type: Number, default: 10 },
    },
    bizPlan: {
        type: String,
        default: "gratis",
        enum: ["gratis", "bronze", "prata", "ouro"], // 3 paid version and 1 free version
    },
    bizPlanList: [BizPlanListSchema],
    // end premium plans

    // address
    bizCep: String, // NOT IMPLEMENTED YET - change to number when using this later (only in dash optional)
    bizAddress: { type: String, lowercase: true, trim: true }, // NOT IMPLEMENTED YET (only in dash optional)
    // end address

    // self-service
    selfBizLogoImg: String,
    selfMilestoneIcon: String,
    selfThemePColor: String,
    selfThemeSColor: String,
    selfThemeBackColor: String,
    // end self-service

    totalClientUserScores: Number,
    totalClientUsers: Number,

    rewardScore: Number, // prior maxScore
    rewardDeadline: { type: Number, default: 30 },
    mainReward: String,
    arePrizesVisible: Boolean,
    rewardList: [RewardListSchema],

    verificationPass: String,
    regulation: RegulationSchema,

    onceChecked: OnceCheckedSchema, // NOT IMPLEMENTED YET
    notifications: [NotificationsSchema],
    tasks: [TasksListSchema],

    smsBalance: { type: Number, default: 0 },
    smsHistory: [SmsHistorySchema],
    smsAutomation: [SmsAutomationSchema],
    orders: [OrdersSchema],
    // pendingRegisters: [PendingRegistersSchema],
};
const ClientAdminDataSchema = new Schema(clientAdminData, { _id: false });
// depracated but it was working well.
// ClientAdminDataSchema.pre('save', function(next) {
//     this.bizPlanCode = generatePlanCodes();
//     next();
// });
// End Client Admin

// Central Admin
const centralAdminData = {
    subRole: {
        type: String,
        default: "rep-vendas",
        enum: ["dev", "rep-vendas", "ops-vendas"],
    },
    payments: {
        grossIncome: Number,
        liquidIncome: Number,
        transitionTax: Number,
    },
};
const CentralAdminDataSchema = new Schema(centralAdminData, { _id: false });
// End Central Admin
// END USER'S ROLES

// Profile
const data = {
    role: {
        type: String,
        default: "cliente-admin",
        enum: ["admin", "cliente-admin", "cliente"],
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
    cpf: {
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
        default: "Não selecionado",
    },
    clientUserData: ClientUserDataSchema,
    clientAdminData: ClientAdminDataSchema,
    centralAdminData: CentralAdminDataSchema,
    filter: DefaultFilterSchema,
    // staffBookingList: Array, // L
};
// End Profile

const UserSchema = new Schema(data, { timestamps: true });
module.exports = mongoose.model("User", UserSchema, collectionName);

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


UserSchema.pre('findOneAndUpdate', async function(next) {
    const doc = await this.model.findOne(this.getQuery());

    next();
});
 */
