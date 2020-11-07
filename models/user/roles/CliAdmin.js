const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const collectionName = "user_cli-admins";

const {
    ClientAdminSchema,
    ClientUserSchema,
} = require("../schemes/data-by-role/main");
const { DefaultFilterSchema } = require("../schemes");
const { profileSchema } = require("../schemes/profileSchema");

const data = {
    ...profileSchema,
    clientAdminData: ClientAdminSchema,
    clientUserData: ClientUserSchema, // used for testing mode
    filter: DefaultFilterSchema,
    pswd: String,
    expiryToken: {
        current: String, // set this to null whenever the user has succeed his/her action
        loginAttempts: { type: Number, default: 0 }, // block access every 2 wrong password sequence and set a progressive timer to be able type again.
        history: [],
    }, // use for events that requires a speficic time to action before expiration.
};

const CliAdmin = new Schema(data, { timestamps: true });
module.exports = mongoose.model("CliAdmin", CliAdmin, collectionName);

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
