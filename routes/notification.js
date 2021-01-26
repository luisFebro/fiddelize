const express = require("express");
const router = express.Router();

const {
    readNotifications,
    sendNotification,
    markOneClicked,
    markAllAsClicked,
    markAllAsSeen,
    countPendingNotif,
} = require("../controllers/notification");

const { mwIsAuth } = require("../controllers/auth");

const { mwUserId } = require("../controllers/user");

// @ routes api/notification/...
router.get("/read/:userId", mwIsAuth, readNotifications); //
router.get("/count-pending-notification", countPendingNotif);
router.put("/send", sendNotification); // mwIsAuth,
router.put("/mark-one-clicked/:userId", markOneClicked);
router.put("/mark-all-clicked/:userId", markAllAsClicked);
router.put("/mark-all-seen/:userId", markAllAsSeen);

router.param("userId", mwUserId);

module.exports = router;
