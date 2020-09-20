const express = require("express");
const router = express.Router();

const { checkout, init, transactions } = require("../controllers/pay");

const { mwIsAuth } = require("../controllers/auth");

const { mwUserId } = require("../controllers/user");

// @ routes api/pay/...
router.post("/transparent-checkout/code", init.createTransparentCode);
router.post("/default-checkout/code", init.createDefaultCode);
router.get("/transactions/history", mwIsAuth, transactions.readHistory);
router.get("/transactions/read-one", mwIsAuth, transactions.readTransaction);
router.post("/transactions/refunds", mwIsAuth, transactions.refundTransaction);
router.post("/transactions/cancels", mwIsAuth, transactions.cancelTransaction);
// transparent Checkout - full control

// router.param("userId", mwUserId);

module.exports = router;
