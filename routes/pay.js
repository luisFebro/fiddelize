const express = require("express");
const router = express.Router();

const { checkout, transactions, boleto } = require("../controllers/pay");

const { mwIsAuth } = require("../controllers/auth");

const { mwUserId } = require("../controllers/user");

// @ routes api/pay/...
router.post("/transparent-checkout/start", mwIsAuth, checkout.startCheckout);
router.post(
    "/transparent-checkout/finish",
    mwIsAuth,
    checkout.finishCheckout,
    boleto.createBoleto
);
router.get("/transactions/history", mwIsAuth, transactions.readHistory);
router.post("/transactions/refunds", mwIsAuth, transactions.refundTransaction);
router.post("/transactions/cancels", mwIsAuth, transactions.cancelTransaction);
router.post("/pag-notify", transactions.getPagNotify);
// transparent Checkout - full control

// router.param("userId", mwUserId);

module.exports = router;
