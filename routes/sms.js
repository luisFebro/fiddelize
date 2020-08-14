const express = require("express");
const router = express.Router();

const {
    readContacts,
    mwSendSMS,
    getMainCardInfos,
    getGeneralTotals,
    readSMSMainHistory,
    readSMSHistoryStatement,
    addSMSHistory,
    readCredits,
    mwDiscountCredits,
} = require("../controllers/sms");

const { mwIsAuth } = require("../controllers/auth");

const {
    mwUserId
} = require("../controllers/user");

// @ routes api/sms/...
router.get('/read/contacts', readContacts); // mwIsAuth,
router.post('/send', mwSendSMS, mwDiscountCredits, addSMSHistory); // mwIsAuth,
router.get('/history/general-totals', getGeneralTotals);
router.get('/history/read-main', readSMSMainHistory); // mwIsAuth
router.get('/history/read-statement', readSMSHistoryStatement); // mwIsAuth
router.get('/credits/read', readCredits);

// router.param("userId", mwUserId);

module.exports = router;