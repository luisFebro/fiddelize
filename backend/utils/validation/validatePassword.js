function validatePassword(pass) {
    const regEx = /\d/;
    return regEx.test(pass);
}

module.exports = validatePassword;