const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { NotificationsSchema, OnceCheckedSchema } = require("../schemes.js");

const taskListData = {
    memberTask: { type: String, enum: ["newScore", "newClient"] },
    clientName: String,
    clientScore: Number,
    createdAt: { type: Date, default: new Date() },
    // only for admin data format
    // memberName: String,
    // job: String
    // content: String (optional standby)
};
const TaskListSchema = new Schema(taskListData, { _id: false });

const clientMemberData = {
    bizId: { type: String },
    job: {
        type: String,
        default: "vendas",
        enum: ["vendas", "atendimento", "caixa", "gerência", "admin"],
    },
    newClientTotal: { type: Number, default: 0 },
    newScoreTotal: { type: Number, default: 0 },
    // content: String,
    notifications: [NotificationsSchema],
    onceChecked: OnceCheckedSchema,
    taskList: [TaskListSchema],
};

const ClientMemberSchema = new Schema(clientMemberData, { _id: false });
module.exports = ClientMemberSchema;
