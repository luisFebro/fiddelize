const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const collectionName = "product-categories";

const data = {
    name: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        maxlength: 32,
        unique: true
    },
    icon: {
        data: Buffer,
        contentType: String
    },
}

const categorySchema = new Schema(data, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema, collectionName);
