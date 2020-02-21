const express = require('express');
const router = express.Router();
const {
    create,
    read,
    remove,
    update,
    updateProductInfo,
    getList,
    getCategoryList,
    getRelatedList,
    getFavoriteList,
    mwPhoto,
    mwProductId,
    mwBackup
} = require('../../controllers/product');
const { mwUserId } = require('../../controllers/user');

// @routes  api/product...

// CRUD
router.post("/", create); // /:userId mwRequireSignin, mwIsAdmin
router.get("/:productId", read);
router.put("/:productId", update);
router.delete('/:productId', mwBackup, remove);
// END CRUD

router.get("/photo/:productId", mwPhoto);
router.put("/:productId/product-info/update", updateProductInfo);

// LISTS
router.get("/list/all", getList);
router.get("/list/related/:productId", getRelatedList);
router.get("/list/category", getCategoryList);
router.get("/:userId/list/favorite", getFavoriteList);
// END LISTS

router.param('productId', mwProductId); // n1
router.param('userId', mwUserId);

module.exports = router;


/* COMMENTS
n1: It is not use dashed like "product-id" because returns unexpected responses.
*/