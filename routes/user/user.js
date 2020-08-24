const express = require('express');
const router = express.Router();
const {
    read,
    update,
    remove,
    confirmUserAccount,
    addElementArray,
    removeElementArray,
    removeField,
    readBackup,
    createBooking,
    mwUserId,
    mwBackup,
    addPurchaseHistory,
    readHistoryList,
    changePrizeStatus,
    countField,
    uploadImages,
    updateImages,
    redirectUrlLink,
    gotUsersInThisChallenge,
    readPrizes,
} = require("../../controllers/user");

const {
    getRecordedClientList,
    getHighestScores
} = require("../../controllers/user/clients-session/recordedClients");

const { mwIsCliAdmin, mwIsAuth, } = require("../../controllers/auth");
// @route  api/user
// RUD
router.get("/:userId", read); // mwIsAuth JWT ERROR: jwt must be provided when log it
router.put("/:userId", update); // mwIsAuth
router.delete('/:userId', mwBackup, remove);
// END RUD

router.get("/confirm-account/:authUserId", confirmUserAccount);

// purchase history
router.put('/purchase-history/:userId', addPurchaseHistory);
router.put('/purchase-history/update-status/:userId', changePrizeStatus);
router.get("/list/purchase-history/:userId", readHistoryList);
router.get("/list/purchase-history/prizes/:userId", readPrizes);
// end purchase history

// LISTS
router.get("/list/all", mwIsAuth, getRecordedClientList);
router.get("/list/highest-scores", getHighestScores);
router.get("/:userId/backup/list", mwIsCliAdmin, readBackup); // mwIsAuth

router.put("/count/field/:userId", countField);
router.get("/redirect/url-link", redirectUrlLink);
router.get("/check/user-challenges", gotUsersInThisChallenge);

// IMAGES
router.post("/image/upload", uploadImages);
router.put("/image/update", updateImages);

// FIELDS
// Array Fields handled: none
router.put('/field/array/push/:id', addElementArray);
router.put('/field/array/pull/:id', removeElementArray);
router.put('/field/remove/:id', removeField);


router.param("userId", mwUserId); // n1

module.exports = router;

/* ARCHIVES
router.get("/staff-booking/list/:userId", getStaffClientList);
router.delete('/:userId', mwRemoveAllBookingsFromAStaff, mwBackup, remove);

const { mwRemoveAllBookingsFromAStaff } = require("../../controllers/staffBooking");
 */




// THIS WILL REFACTORATED TO RECEIVE IDS LIKE I DID WITH FAVORITES AND UPDATE WITH FIELD ROUTES.
// NOTIFICATION SYSTEM
// @route   ADD (a primary field) api/users/lists/change-field/notifications/:id
// @desc    Send/Add a notification (clients <==> admin)
// @access  Private
// req.body = { "messageList": [{sender: 'LuisCliente', id: '123hgfssax4556', time: '12:30', message: "Hi there, Iam a new client!"}]}
// router.put('/lists/change-field/notifications/:id', (req, res) => {
//     User.findByIdAndUpdate(req.params.id, { $push: req.body }, { strict: false, upsert:true }, (err, data) => {
//         if (err) {
//             return res
//                 .status(500)
//                 .json({error: "unsuccessful. message no sent"})
//         }
//         data.save();
//         res.json( data )
//     })
//     // .sort({ systemDate: -1 }) try only this next time
//     // .then(not => res.json(not))
// });
// // @route   DELETE (a primary field) api/users/lists/change-field/notifications/:id
// // @desc    Delete a notification (clients <==> admin)
// // @access  Private
// router.put('/lists/delete-field-array/notifications/:id', (req, res) => {
//     User.findByIdAndUpdate(req.params.id, { $pull: req.body }, (err, data) => {
//         if (err) {
//             return res
//                 .status(500)
//                 .json({error: "unsuccessful. not deleted"})
//         };
//         data.save();
//         res.json(data);
//     })
// });
// // END NOTIFICATION SYSTEM



/* COMMENTS
n1: // Everytime there is a userId, this router will run and make this user info available in the request object
n2:
// eg. req.body = { "couponsList": {type: '30% de desconto'}}
req.body = {sex: "male"} = add male as ind 0 from an array
n3: LESSON: don't insert MongoDB Models twice like here (const User = require('../../models/User');) in routes and controllers
because this causes deployment issue and this error: OverwriteModelError: Cannot overwrite `User` model once compiled.
*/