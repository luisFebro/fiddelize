const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const collectionName = "admin";

const data = {
    limitFreePlanNewUsers: Number,
    mainSalesWhatsapp: String,
    mainTechWhatsapp: String,
    businessInfo: {
        type: Schema.ObjectId,
        ref: 'BusinessInfo',
    },
    totalClientUsers: Number, // NOT IMPLEMENTED
    totalClientAdmin: Number, // NOT IMPLEMENTED
    totalClientAdminScores: Number, // NOT IMPLEMENTED
}

const adminSchema = new Schema(data, { timestamps: true });
module.exports = mongoose.model('Admin', adminSchema, collectionName);


/*ARCHIVES
verificationPass: {
    type: String,
    default: "slb19"
},
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
