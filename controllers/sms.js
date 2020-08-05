const User = require('../models/user');
const { msgG } = require('./_msgs/globalMsgs');
const convertPhoneStrToInt = require('../utils/number/convertPhoneStrToInt');
// const { getChunksTotal, getDataChunk } = require("../../utils/array/getDataChunk");

// GET
exports.readContacts = (req, res) => {
    const { adminId } = req.query;

    if(!adminId) return res.status(400).json({msg: "Missing admin ID"})

    User.find({ "clientUserData.bizId": adminId })
    .select("phone name")
    .exec((err, data) => {
        if (err) return res.status(500).json(msgG('error.systemError', err))

        const finalRes = [];
        data.forEach(user => {
            if(user._id.toString() !== adminId) {
                finalRes.push(`clientName:${user.name};phone:${user.phone};`)
            }
        })

        res.json(finalRes);
    });
}

// Method: POST
exports.sendSMS = (req, res) => {
    // convertPhoneStrToInt
    const { contactList, message } = req.body;
    if(!message) return res.status(400).json({ error: "A message with at least 1 character should be passed"})
    console.log("message", message);
    console.log("contactList", contactList);
}