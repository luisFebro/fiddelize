const express = require("express");
const router = express.Router();

const { isUserProAlready } = require("../controllers/pro/pro.js");

// const { mwIsAuth } = require("../controllers/auth");

// const {
//     mwUserId
// } = require("../controllers/user");

// @ routes api/pro/...
router.get("/pro-member-check", isUserProAlready);

// router.param("userId", mwUserId);

module.exports = router;
