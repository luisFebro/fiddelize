const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const collectionName = "user_cli-members";

const { ClientMemberSchema } = require("../schemes/data-by-role/main");
const { DefaultFilterSchema } = require("../schemes");
const { profileSchema } = require("../schemes/profileSchema");

// PROFILE
const data = {
    ...profileSchema,
    clientMemberData: ClientMemberSchema,
    filter: DefaultFilterSchema,
};
// END PROFILE

const CliMember = new Schema(data, { timestamps: true });
module.exports = mongoose.model("CliMember", CliMember, collectionName);

/* COMMENTS
n1: LESSON: JSON does not accept numbers which starts with 0
L: LESSON: if you need get the length of the arrays to sort them, just reference the field's array themselves.array
It does not need to write a new field with length:
staffBookingsSize: {
        type: Number,
        default: function() {
            return this.staffBookingList.length`;
        }
    },
By the way, this field will not be sorted at all
This is how I sorted by the largest length of items, and then sorted by name:
.sort({ staffBookingList: 1, name: 1 })
*/

/* ARCHIVES
// pswdGoogle: {
    //     email: String,
    //     pswd: String,
    //     pic: String,
    // }, // from oAuth2
    // staffBookingList: Array, // L

// TEMP AUTH USER ID
const dataTempAuthUserToken = {
    this: {
        type: String,
        default: '',
    },
    createdAt: { type: Date, default: Date.now, expires: '1m' }
}

const UserTokenSchema = new Schema(dataTempAuthUserToken);
// END TEMP AUTH USER ID


UserSchema.pre('findOneAndUpdate', async function(next) {
    const doc = await this.model.findOne(this.getQuery());

    next();
});
 */
