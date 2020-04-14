const express = require('express');
const router = express.Router();
const {
    createOrUpdate,
    updateBusinessInfo,
    read,
    getCoupon,
    updateCoupon,
    mwPhoto,
    mwAdminId,
    updateConfig,
    // Services
    createService,
    readServicesList,
    updateService,
    deleteService,
    // End
    checkVerificationPass,
    readVerificationPass,
    createOrUpdateRegText,
    // countAppDownloads,
} = require('../controllers/admin');

const { mwIsAdmin, mwIsClientAdmin } = require("../controllers/auth");
const { mwUserId } = require("../controllers/user");

// @ routes api/admin

router.get("/", read);
router.put("/", createOrUpdate);

router.get("/photo/:adminId", mwPhoto);
router.put("/business-info/update", updateBusinessInfo);

router.put("/config", updateConfig);

router.get("/verification-pass/:userId", mwIsClientAdmin, readVerificationPass);
router.post("/verification-pass", checkVerificationPass);

// Services CRUD
router.post("/service/:userId", mwIsAdmin, createService); // :userId is used to verify mwIsAdmin
router.get("/service/list/all", readServicesList);
router.put("/service/:userId", mwIsAdmin, updateService);
router.delete("/service/:userId", mwIsAdmin, deleteService);
// End Services CRUD

// router.put("/app/downloads", countAppDownloads);

router.param('adminId', mwAdminId);
router.param('userId', mwUserId);

module.exports = router;