const express = require("express");
const router = express.Router();

const {
    startCheckout,
    finishCheckout,
} = require("../controllers/pay/checkout");
const getPagNotify = require("../controllers/pay/pag-notification");
const {
    startSplit,
    getPayMethods,
    getCreditCardFlag,
} = require("../controllers/pay/split/split");
const {
    getBalance,
    requestAuthorization,
    transfer,
} = require("../controllers/pay/transfer/transfer");

const { mwIsAuth } = require("../controllers/auth");
const { mwUserId } = require("../controllers/user");

// @ routes api/pay/...
// transparent Checkout - full control
router.post("/transparent-checkout/start", mwIsAuth, startCheckout);
router.post("/transparent-checkout/finish", mwIsAuth, finishCheckout);
router.post("/pag-notify", getPagNotify);
// split
router.post("/split/start", startSplit);
router.get("/split/pay-methods", getPayMethods);
router.get("/split/credit-card-flag", getCreditCardFlag);
// transfer
router.get("/transfer/balance", getBalance);
router.post("/transfer/request", requestAuthorization);
router.post("/transfer/finish", transfer);

// router.param("userId", mwUserId);
module.exports = router;

/* ARCHIVES
const { transactions } = require("../controllers/pay");
router.get("/transactions/history", mwIsAuth, transactions.readHistory);
router.post("/transactions/refunds", mwIsAuth, transactions.refundTransaction);
router.post("/transactions/cancels", mwIsAuth, transactions.cancelTransaction);
*/
