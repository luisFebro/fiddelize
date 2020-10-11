const express = require("express");
const router = express.Router();

const {
    getProData,
    mwDiscountProCredits,
    removeProServices,
    getNextExpiryDate,
} = require("../controllers/pro/pro.js");

// const { mwIsAuth } = require("../controllers/auth");

// const {
//     mwUserId
// } = require("../controllers/user");

// @ routes api/pro/...
router.get("/pro-member-data", getProData);
router.delete("/service/remove", removeProServices);
router.get("/service/next-expiry-date", getNextExpiryDate);
// test
router.get("/discount", mwDiscountProCredits);

// router.param("userId", mwUserId);

module.exports = router;
