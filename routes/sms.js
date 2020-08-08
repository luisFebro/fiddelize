const express = require("express");
const router = express.Router();

const {
    readContacts,
    sendSMS,
    readSMSHistory,
} = require("../controllers/sms");

const { mwIsAuth } = require("../controllers/auth");

const {
    mwUserId
} = require("../controllers/user");

// @ routes api/sms/...
router.get('/read/contacts', readContacts); // mwIsAuth,
router.post('/send/:userId', mwIsAuth, sendSMS);
router.get('/read-sms-history', readSMSHistory); // mwIsAuth

// router.param("userId", mwUserId);

module.exports = router;