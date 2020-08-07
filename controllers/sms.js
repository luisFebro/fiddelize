const User = require('../models/user');
const { msgG } = require('./_msgs/globalMsgs');
const convertPhoneStrToInt = require('../utils/number/convertPhoneStrToInt');
// const { getChunksTotal, getDataChunk } = require("../../utils/array/getDataChunk");

// GET
exports.readContacts = (req, res) => {
    let {
        userId,
        limit = 5,
        search = "",
        contactFrom = "",
        autocomplete = false, // retuns as string.
        autocompleteLimit = 4,
    } = req.query;

    if(!search && !autocomplete) limit = "";

    if(!userId) return res.status(400).json({msg: "Missing admin ID"})

    let findThis = { "clientUserData.bizId": userId };
    if(contactFrom) findThis = { "clientUserData.bizId": userId, name: contactFrom };
    if(search && autocomplete) {
        const regexSearch = { $regex: `${search}`, $options: 'i'};
        findThis = { "clientUserData.bizId": userId, name: regexSearch };
    }

    User.find(findThis)
    .limit(limit)
    .select("phone name")
    .sort({ name: 1 })
    .exec((err, data) => {
        if (err) return res.status(500).json(msgG('error.systemError', err))

        let finalRes = [];
        data.forEach(user => {
            if(user._id.toString() !== userId) {
                if(autocomplete) {
                    finalRes.push(user.name);
                } else {
                    finalRes.push({ name: user.name, phone: user.phone })
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
    const { userId } = req.params;
    console.log("userId", userId);
    const { contactList, msg } = req.body;
    if(!msg) return res.status(400).json({ error: "A message with at least 1 character should be passed"})
    console.log("msg", msg);
    console.log("contactList", contactList);
}