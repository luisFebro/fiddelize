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
    cancelSMS,
} = require("../controllers/sms");

const { mwIsAuth } = require("../controllers/auth");

const {
    mwUserId
} = require("../controllers/user");

// @ routes api/sms/...
router.get('/credits/read', readCredits);
router.get('/read/contacts', mwIsAuth, readContacts);
router.post('/send', mwIsAuth, mwSendSMS, mwDiscountCredits, addSMSHistory);
router.get('/history/general-totals', getGeneralTotals);
router.get('/history/read-main', mwIsAuth, readSMSMainHistory);
router.get('/history/read-statement', mwIsAuth, readSMSHistoryStatement);
router.put('/cancel', mwIsAuth, cancelSMS);

// router.param("userId", mwUserId);

module.exports = router;