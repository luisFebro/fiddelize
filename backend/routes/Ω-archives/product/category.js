const express = require("express");
const router = express.Router();

// const { mwUserId } = require("../controllers/user");
const {
    create,
    read,
    update,
    remove,
    mwCategoryId,
    getList
} = require("../../controllers/product/category");
const { mwIsAdmin } = require("../../controllers/auth");

// @route  api/category...
// CRUD
router.post("/", create); ///:userId mwRequireSignin, mwIsAuth, mwIsAdmin
router.get("/:categoryId", read)
router.put("/:categoryId", update); // :userId mwRequireSignin, mwIsAuth, mwIsAdmin,
router.delete("/:categoryId", remove); // /:userId mwRequireSignin, mwIsAuth, mwIsAdmin,
// END CRUD

router.get("/list/all", getList); // we can not use /categories directly since /:categoryId will be executed. We need one more level

router.param("categoryId", mwCategoryId)
// router.param("userId", mwUserId)

module.exports = router;