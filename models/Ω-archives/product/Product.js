const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const collectionName = "products"
const addDashesToString = require('../../utils/string/addDashesToString');
const generateRefCode = require('../../utils/string/generateRefCode');

const data = {
    category: {
        type: Schema.ObjectId,
        ref: "Category",
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    refCode: {
        type: String,
        default: "CRE12"
    },
    link: String,
    mainDescription: {
        type: String,
        required: true,
        maxlength: 2000,
        default: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta, odio dignissimos voluptate consequatur quos molestias necessitatibus nisi sit optio eius maiores qui quo incidunt",
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    price: {
        type: Number,
        default: 40,
        required: true
    },
    info: {
        type: Schema.ObjectId,
        ref: 'ProductInfo',
    },
    quantity: {
        type: Number,
        default: 1
    },
    sold: {
        type: Number,
        default: 0
    },
    isReadyToPopulate: {
        type: Boolean,
        default: false
    }
}


const productSchema = new Schema(data, { timestamps: true });

productSchema.pre('save', function(next) {
    this.link = addDashesToString(this.title);
    this.refCode = generateRefCode(this.title);
    next();
});

module.exports = mongoose.model('Product', productSchema, collectionName);



