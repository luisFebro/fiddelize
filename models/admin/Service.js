const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const collectionName = "admin-services";

const data = {
    name: {
        type: String,
        lowercase: true,
        trim: true,
    }
}

const ServiceSchema = new Schema(data, { timestamps: true });
module.exports = mongoose.model("Service", ServiceSchema, collectionName);
