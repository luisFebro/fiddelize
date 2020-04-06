const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const collectionName = "admin";

const data = {
    verificationPass: {
        type: String,
        default: "slb19"
    },
    limitFreePlanNewUsers: Number,
    businessInfo: {
        type: Schema.ObjectId,
        ref: 'BusinessInfo',
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


/*ARCHIVES
siteBackgroundColor: {
    type: String,
    default: "black"
},
trademark: {
    data: Buffer,
    contentType: String
},
regulationText: {
    type: String,
},
*/
