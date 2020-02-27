const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const collectionName = "business-info";

// BIZ PROMOTIONS
const dataPromotions = {
    // product: { type: Schema.ObjectId, ref: "Product" },
    coupons: Object,
}
const BizPromotionsSchema = new Schema(dataPromotions, { _id: false, timestamps: true });
// END BIZ PROMOTIONS

// BIZ WORKING HOUR
// Object = {start: Number end: Number dayOff: Boolean}
const dataWorkingHours = {
    breakTime: Boolean,
    monday: Object,
    tuesday: Object,
    wednesday: Object,
    thirsday: Object,
    friday: Object,
    saturday: Object,
    sunday: Object,
}
const BizWorkingHoursSchema = new Schema(dataWorkingHours, { _id: false, timestamps: true });
// END WORKING HOUR

// BIZ DEV
const dataDev = {
    name: String,
    slogon: String,
    email: String
}
const BizDevSchema = new Schema(dataDev, { _id: false, timestamps: true });
// END BIZ DEV

// BIZ SHIPPING RATES
const dataShipping = {
    local: Object,
}
const BizShippingRatesSchema = new Schema(dataShipping, { _id: false, timestamps: true });
// END BIZ SHIPPING RATE

const data = {
    bizOwner: String,
    bizName: String,
    bizAddress: String,
    bizCnpj: Number,
    bizSlogon: String,
    bizEmail: String,
    bizWhatsapp: Number,
    bizWebsite: String,
    bizFacebook: String,
    bizInstagram: String,
    bizDev: BizDevSchema,
    bizPromotions: BizPromotionsSchema,
    bizShippingRates: BizShippingRatesSchema,
    bizWorkingHours: BizWorkingHoursSchema
}

const BusinessInfoSchema = new Schema(data, { timestamps: true });

module.exports = mongoose.model("BusinessInfo", BusinessInfoSchema, collectionName);


/* JSON REFERENCE FOR POSTMAN
{
    "bizPromotions": {
        "coupons": {
            "firstOrder": {
                "name": "10% de desconto na primeira compra",
                "isActivated": false
            }
        }
    },
    "bizOwner": "",
    "bizName": "Studio Love Beauty",
    "bizAddress": "",
    "bizCnpj": "",
    "bizSlogon": "",
    "bizEmail": "",
    "bizWhatsapp": "",
    "bizWebsite": "https://studiolovebeauty.com",
    "bizFacebook": "",
    "bizInstagram": "https://www.instagram.com/studio_lovebeauty",
    "bizDev": {
        "name": "Febro",
        "slogon": "Projetos Web",
        "email": "febro.projetosweb@gmail.com"
    },
    "bizShippingRates": {
        "local": {
            "main": 15,
            "secondary": 25,
            "third": 100
        }
    },
    "bizWorkingHours": {
        "breakTime": false,
        "monday": {"start": 8, "end": 18, "dayOff": false},
        "tuesday": {"start": 8, "end": 18, "dayOff": false},
        "wednesday": {"start": 8, "end": 18, "dayOff": false},
        "thirsday": {"start": 8, "end": 18, "dayOff": false},
        "friday": {"start": 8, "end": 18, "dayOff": false},
        "saturday": {"start": 8, "end": 20, "dayOff": false},
        "sunday": {"start": 8, "end": 18, "dayOff": true}
    }
}
*/
