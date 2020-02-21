const express = require('express');
const router = express.Router();
const {
    mwCreate,
    update,
    mwRemove,
    getList,
    getUniqueStaffIds,
    addBookingIdToStaff,
    checkStatusAndUpdateMany,
    removeBookingIdFromStaff,
    getAllClientsNameFromStaff,
} = require("../controllers/staffBooking");
const {
    mwUserId
} = require("../controllers/user");
const {
    mwIsAdmin
} = require("../controllers/auth");

// @route  api/staff-booking
router.post("/:userId", mwCreate, addBookingIdToStaff);
router.put("/:bookingId", update);
router.put("/remove/:userId", mwRemove, removeBookingIdFromStaff); // need mwIsAdmin //

router.put("/status/:userId", checkStatusAndUpdateMany);

// LISTS
router.get("/list/all", getList);
router.get("/list/clients-name-from-staff", getAllClientsNameFromStaff);

router.param("userId", mwUserId);

module.exports = router;