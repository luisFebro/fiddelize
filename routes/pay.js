const express = require("express");
const router = express.Router();

const { checkout, transparentCheckout } = require("../controllers/pay");

const { mwIsAuth } = require("../controllers/auth");

const { mwUserId } = require("../controllers/user");

// @ routes api/pay/...
router.get("/transactions/history", mwIsAuth, checkout.readHistory);
router.get("/transactions/read-one", mwIsAuth, checkout.readTransaction);
router.post("/checkout", mwIsAuth, checkout.createCode);
router.post("/transactions/refunds", mwIsAuth, checkout.refundTransaction);
router.post("/transactions/cancels", mwIsAuth, checkout.cancelTransaction);
// transparent Checkout - full control
router.post("/sessions", mwIsAuth, transparentCheckout.createSessionCode);

// router.param("userId", mwUserId);

module.exports = router;
