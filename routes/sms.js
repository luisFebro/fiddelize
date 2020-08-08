const express = require("express");
const router = express.Router();

const {
    readContacts,
    sendSMS,
    getMainCardInfos,
    getTotalTransitions,
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
router.get('/read-sms-main', getMainCardInfos); // mwIsAuth
router.get('/read-total-transitions', getTotalTransitions); // mwIsAuth

// router.param("userId", mwUserId);

module.exports = router;