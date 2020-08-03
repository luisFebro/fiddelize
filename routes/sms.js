const express = require("express");
const router = express.Router();

const {
    readContacts
} = require("../controllers/sms");

const { mwIsAuth } = require("../controllers/auth");

const {
    mwUserId
} = require("../controllers/user");

// @ routes api/sms/...
router.get('/read/contacts', readContacts); // mwIsAuth

// router.param("userId", mwUserId);

module.exports = router;