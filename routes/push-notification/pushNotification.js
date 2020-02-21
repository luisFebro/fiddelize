const express = require('express');
const router = express.Router();
const {
    getPushNotification
} = require("../../controllers/push-notification");

// @route  api/push-notification
router.post("/subscribe", getPushNotification);

module.exports = router;