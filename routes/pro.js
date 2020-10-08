const express = require("express");
const router = express.Router();

const { getProData } = require("../controllers/pro/pro.js");

// const { mwIsAuth } = require("../controllers/auth");

// const {
//     mwUserId
// } = require("../controllers/user");

// @ routes api/pro/...
router.get("/pro-member-data", getProData);

// router.param("userId", mwUserId);

module.exports = router;
