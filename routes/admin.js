const express = require("express");
const router = express.Router();
const {
    createOrUpdate,
    updateBusinessInfo,
    read,
    mwAdminId,
    updateConfig,
    checkVerificationPass,
    readVerificationPass,
} = require("../controllers/central-admin/admin");

const {
    createOrUpdateService,
    readServices,
} = require("../controllers/central-admin/pricing");

const { mwIsAdmin, mwIsClientAdmin } = require("../controllers/auth");
const { mwUserId } = require("../controllers/user");

// @ routes api/admin

router.get("/", read);
router.put("/", createOrUpdate);

router.put("/business-info/update", updateBusinessInfo);

router.get("/verification-pass/:userId", mwIsClientAdmin, readVerificationPass);
router.post("/verification-pass", checkVerificationPass);

router.get("/service/list", readServices);
router.put("/service/pricing", createOrUpdateService);

router.param("adminId", mwAdminId);
router.param("userId", mwUserId);

module.exports = router;

/*ARCHIVES

router.put("/config", updateConfig);

router.get("/photo/:adminId", mwPhoto);

// Services CRUD
router.post("/service/:userId", mwIsAdmin, createService); // :userId is used to verify mwIsAdmin
router.get("/service/list/all", readServicesList);
router.put("/service/:userId", mwIsAdmin, updateService);
router.delete("/service/:userId", mwIsAdmin, deleteService);
// End Services CRUD

// router.put("/app/downloads", countAppDownloads);
*/
