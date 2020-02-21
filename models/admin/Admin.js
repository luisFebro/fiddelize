const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const collectionName = "admin";

const data = {
    siteBackgroundColor: {
        type: String,
        default: "black"
    },
    trademark: {
        data: Buffer,
        contentType: String
    },
    verificationPass: {
        type: String,
        default: "slb19"
    },
    businessInfo: {
        type: Schema.ObjectId,
        ref: 'BusinessInfo',
    },
    regulationText: {
        type: String,
    },
    app: {
        downloads: {
            type: Number,
            default: 0,
        }
    }
}

const adminSchema = new Schema(data, { timestamps: true });
module.exports = mongoose.model('Admin', adminSchema, collectionName);



