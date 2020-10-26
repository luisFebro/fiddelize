const express = require("express");
const router = express.Router();

const { sendEmail } = require("../controllers/email");

const { mwValidateBuyRequest } = require("../controllers/_mw-validation/email");
const { mwValidateEmail } = require("../controllers/_mw-validation/auth");

// @ routes api/email/...
router.post("/send", sendEmail);
module.exports = router;
