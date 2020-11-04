const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const collectionName = "all-clients";
const { roleTypes } = require("./schemes/roles/main");
// const generatePlanCodes = require("../../utils/string/generateAlphaNumeric");
const { DefaultFilterSchema } = require("./schemes");
const {
    BizTeamSchema,
    ClientAdminSchema,
    ClientMemberSchema,
    ClientUserSchema,
} = require("./schemes/roles/main");

// PROFILE
const data = {
    role: {
        type: String,
        default: "cliente-admin",
        enum: [...roleTypes],
    },
    name: {
        type: String,
        trim: true,
        maxlength: 40,
        required: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    cpf: {
        type: String,
        unique: true,
    },
    phone: {
        type: String,
    },
    birthday: {
        type: String,
    },
    maritalStatus: {
        type: String,
        default: "Não selecionado",
    },
    clientUserData: ClientUserSchema,
    clientAdminData: ClientAdminSchema,
    clientMemberData: ClientMemberSchema,
    bizTeamData: BizTeamSchema,
    filter: DefaultFilterSchema,
    pswd: String,
    expiryToken: {
        current: String, // set this to null whenever the user has succeed his/her action
        loginAttempts: { type: Number, default: 0 }, // block access every 2 wrong password sequence and set a progressive timer to be able type again.
        history: [],
    }, // use for events that requires a speficic time to action before expiration.
};
// END PROFILE

const UserSchema = new Schema(data, { timestamps: true });
module.exports = mongoose.model("User", UserSchema, collectionName);

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
