const { msgG } = require('./_msgs/globalMsgs');
const User = require('../models/user');
const Finance = require('../models/finance');
const StaffBooking = require('../models/user/StaffBooking');

// exports.deleteAllFieldsInCollection = (req, res) => {
//     Product.updateMany({}, { $unset: req.body})
//     .exec((err, data) => {
//         if(err) return res.status(500).json(msgG('error.systemError', err))
//         res.json(msgG('ok.success'))
//     })
// }

exports.readAllDbFromModels = (req, res) => {
    const modelQuery = req.query.modelName;
    const models = {
        user: User,
        staffBooking: StaffBooking,
        finance: Finance,
    }
    const SelectedModel = new Object(models[modelQuery]);

    const fieldsArray = [];
    for (property in SelectedModel.schema.paths) {
        if(["staffBookingList", "loyaltyScores"].includes(property)) {
            continue;
        }
        fieldsArray.push(property);
    }

    SelectedModel.find({_id: {$ne: "5e360888051f2617d0df2245"}})
    .select("-staffBookingList -loyaltyScores")
    .exec((err, docs) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));
        res.json({
            fields: fieldsArray,
            docs,
        });
    })
}