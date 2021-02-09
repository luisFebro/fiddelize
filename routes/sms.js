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
    activateAutoService,
    readAutoService,
} = require("../controllers/sms");

const { mwIsAuth } = require("../controllers/auth");

const { mwUserId } = require("../controllers/user");

// @ routes api/sms/...
router.get("/credits/read", readCredits);
router.get("/read/contacts", readContacts);
router.post("/send", mwSendSMS, mwDiscountCredits, addSMSHistory); // mwIsAuth disabled temporarily so that cli-members can send sms too without further config.
router.get("/history/general-totals", getGeneralTotals);
router.get("/history/read-main", mwIsAuth, readSMSMainHistory);
router.get("/history/read-statement", mwIsAuth, readSMSHistoryStatement);
router.put("/cancel", mwIsAuth, cancelSMS);
router.get("/automatic/read", readAutoService); // mwIsAuth, the middle is preventing to run this method
router.put("/automatic/activate", mwIsAuth, activateAutoService);

// router.param("userId", mwUserId);

module.exports = router;
