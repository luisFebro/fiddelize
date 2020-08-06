const User = require('../models/user');
const { msgG } = require('./_msgs/globalMsgs');
const convertPhoneStrToInt = require('../utils/number/convertPhoneStrToInt');
// const { getChunksTotal, getDataChunk } = require("../../utils/array/getDataChunk");

// GET
exports.readContacts = (req, res) => {
    const {
        userId,
        limit = 4,
        search = "",
        autocomplete = false, // retuns as string.
        autocompleteLimit = 7,
    } = req.query;

    if(!userId) return res.status(400).json({msg: "Missing admin ID"})

    let findThis = { "clientUserData.bizId": userId };
    if(search && autocomplete) {
        const regexSearch = { $regex: `${search}`, $options: 'i'};
        findThis = { "clientUserData.bizId": userId, name: regexSearch };
    }

    User.find(findThis)
    .limit(limit)
    .select("phone name")
    .exec((err, data) => {
        if (err) return res.status(500).json(msgG('error.systemError', err))

        let finalRes = [];
        data.forEach(user => {
            if(user._id.toString() !== userId) {
                if(autocomplete) {
                    finalRes.push(user.name);
                } else {
                    finalRes.push(`clientName:${user.name};phone:${user.phone};`)
                }
            }
        })

        if(autocomplete) {
            finalRes = finalRes.slice(0, autocompleteLimit);
        }

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