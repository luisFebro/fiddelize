const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const collectionName = "accounts";
const { roleTypes } = require("./schemes/data-by-role/main");

// For account page to enable use to switch between different accounts;
const accountSetData = {
    role: {
        type: String,
        enum: [...roleTypes],
    },
    userId: String,
    bizId: String,
    bizName: String,
    bizImg: { type: String, default: "/img/official-logo-name.png" },
};
const AccountSetSchema = new Schema(accountSetData, { _id: false });

// This will be used after user fill the cpf, after self-service app creation...
const data = {
    checkId: String, // encrypted cpf which will be checked and fetch all user's accounts.
    defaultUserId: String,
    defaultRole: {
        type: String,
        enum: [...roleTypes],
        default: "cliente-admin",
    },
    defaultBizId: String,
    defaultBizImg: String, // img's url form cloudinary
    defaultBizName: String,
    accounts: [AccountSetSchema],
};

const AccountSchema = new Schema(data, { timestamps: false, _id: false });
module.exports = mongoose.model("Account", AccountSchema, collectionName);
