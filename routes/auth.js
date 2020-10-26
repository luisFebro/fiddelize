const express = require("express");
const router = express.Router();
const {
    loadAuthUser,
    register,
    login,
    mwSession,
    mwIsAuth,
    getDecryptedToken,
    getToken,
} = require("../controllers/auth");

const {
    createPassword,
    checkPassword,
    changePassword,
    forgotPasswordRequest,
    recoverPassword,
} = require("../controllers/auth/password");

// const { makeGoogleLogin } = require("../controllers/auth/google");

const {
    mwValidateRegister,
    mwValidateLogin,
    mwValidatePassword,
    mwValidateCPF,
    mwValidateEmail,
} = require("../controllers/_mw-validation/auth");

const { mwProCreditsCounter } = require("../controllers/pro/pro");

// @route   api/auth
router.get("/user", mwSession, loadAuthUser);
router.post("/register", mwValidateRegister, mwProCreditsCounter, register);
router.post("/login", mwValidateLogin, login);
// password
router.post("/pswd/create", mwValidatePassword, createPassword);
router.post("/pswd/check", checkPassword);
router.post(
    "/pswd/forgot",
    mwValidateCPF,
    mwValidateEmail,
    forgotPasswordRequest
);
router.post("/pswd/recover", mwValidatePassword, recoverPassword);
router.post("/pswd/change", mwIsAuth, changePassword);
router.post("/pswd/token", getToken);
router.post("/pswd/decrypt-token", getDecryptedToken);

// router.post("/google", makeGoogleLogin);

module.exports = router;
