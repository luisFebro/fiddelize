const express = require("express");
const router = express.Router();

const {
    readContacts,
    mwSendSMS,
    getMainCardInfos,
    getTotalTransitions,
    readSMSHistory,
    addSMSHistory,
    readHistoryStatement,
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
router.get('/read-sms-main', getMainCardInfos); // mwIsAuth
router.get('/read-total-transitions', getTotalTransitions); // mwIsAuth
router.get('/history/read', readSMSHistory); // mwIsAuth
router.get('/history/read-statement', readHistoryStatement); // mwIsAuth
// router.put('/history/add', addSMSHistory);
router.get('/credits/read', readCredits);
// router.put('/credits/discount', mwDiscountCredits);

// router.param("userId", mwUserId);

module.exports = router;