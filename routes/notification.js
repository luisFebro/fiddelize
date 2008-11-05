const express = require("express");
const router = express.Router();

const {
    readNotifications,
    sendNotification,
    markOneClicked,
    markAllAsClicked,
    markAllAsSeen,
} = require("../controllers/notification");

const { mwIsAuth } = require("../controllers/auth");

const {
    mwUserId
} = require("../controllers/user");

// @ routes api/notification/...
router.get('/read/:userId', mwIsAuth, readNotifications);
router.put('/send', mwIsAuth, sendNotification);
router.put('/mark-one-clicked/:userId', markOneClicked);
router.put('/mark-all-clicked/:userId', markAllAsClicked);
router.put('/mark-as-seen/:userId', markAllAsSeen);

router.param("userId", mwUserId);

module.exports = router;