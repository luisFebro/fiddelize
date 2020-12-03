const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {
    NotificationsSchema,
    OnceCheckedSchema,
    OrdersSchema,
    DefaultFilterSchema,
} = require("../schemes.js");

// SCHEMES
const regulationData = {
    text: {
        type: String,
        trim: true,
    },
    updatedAt: Date,
};
const RegulationSchema = new Schema(regulationData, { _id: false }); // timestamps: true does  not work as a subdocument

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

// sms
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
// end sms

const bizPlanListData = {
    plan: { type: String, enum: ["ouro", "prata", "bronze"] },
    service: {
        type: String,
        enum: [
            "Novvos Clientes",
            "Novvos Membros",
            "Envvio Whatsapp",
            "Orgganize Clientes",
            "Prêmmios Clientes",
        ],
    },
    // creditStart: Number, // For simplification reason, all creditable services will have decrescenting count discount directly from the bizPlanList' s creditEnd
    creditEnd: Number, // max limit
    usageTimeEnd: Date,
    renewalHistory: Array, // e.g { ref: 123, date: dateFormat }
    periodicityBr: { type: String, enum: ["mensal", "anual"] }, // monthly or yearly
};
const BizPlanListSchema = new Schema(bizPlanListData, { _id: true });
// END SCHEMES

const clientAdminData = {
    bizName: String, // required: true,comment out cuz every sign up will request and throw error
    bizCodeName: String,
    bizCnpj: String, // NOT IMPLEMENTED YET
    bizWhatsapp: String,

    // premium plans
    bizFreeCredits: {
        // for package-based services.
        "Novvos Clientes": { type: Number, default: 10 },
        "Novvos Membros": { type: Number, default: 1 },
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

    totalClientUserScores: { type: Number, default: 0 },
    totalClientUsers: { type: Number, default: 0 },
    totalClientMembers: { type: Number, default: 0 },

    memberIdList: Array, // e.g numerical sequence id ["123abc", "321def"]

    rewardScore: Number, // prior maxScore
    rewardDeadline: { type: Number, default: 30 },
    mainReward: String,
    arePrizesVisible: Boolean,
    rewardList: [RewardListSchema],

    verificationPass: String,
    regulation: RegulationSchema,

    onceChecked: OnceCheckedSchema,
    notifications: [NotificationsSchema],
    tasks: [TasksListSchema],

    smsBalance: { type: Number, default: 0 },
    smsHistory: [SmsHistorySchema],
    smsAutomation: [SmsAutomationSchema],
    orders: [OrdersSchema],
    allowedTempLinks: Array, // temp link codes like "app/alan_yvs493z0:5d700207" to allow once once registration and only by invitation codes presented in this list.
};
const ClientAdminSchema = new Schema(clientAdminData, { _id: false });
module.exports = ClientAdminSchema;

/* ARCHIVES
// depracated but it was working well.
ClientAdminSchema.pre('save', function(next) {
    this.bizPlanCode = generatePlanCodes();
    next();
});
 */
