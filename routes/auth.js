const express = require("express");
const router = express.Router();
const {
    loadAuthUser,
    register,
    login,
    mwSession,
    createPassword,
    comparePassword,
    changePassword,
} = require("../controllers/auth");

const {
    mwValidateRegister,
    mwValidateLogin,
    mwValidatePassword,
} = require("../controllers/_mw-validation/auth");

const { mwProCreditsCounter } = require("../controllers/pro/pro");

// @route   api/auth
router.get("/user", mwSession, loadAuthUser);
router.post("/register", mwValidateRegister, mwProCreditsCounter, register);
router.post("/login", mwValidateLogin, login);
// password
router.post("/pswd/create", mwValidatePassword, createPassword);
router.post("/pswd/check", comparePassword);
// router.post("/change-password", mwValidatePassword, changePassword);

module.exports = router;
