const User = require("../../models/user");
const validateEmail = require("../../utils/validation/validateEmail");
const validatePhone = require("../../utils/validation/validatePhone");
const isValidName = require("../../utils/validation/isValidName");
const CPF = require("../../utils/validation/validateCpf");
const { msg } = require("../_msgs/auth");
const { msgG } = require("../_msgs/globalMsgs");
const { jsEncrypt } = require("../../utils/security/xCipher");

const handleRoles = (currRoles, rolesQueryObj) => {
    const { cliAdmin, cliUser } = rolesQueryObj;
    switch (currRoles) {
        case "cliente":
            return cliUser;
        case "cliente-admin":
            return cliAdmin;
        default:
            console.log("somehtign wrong in handleRoles");
    }
};

exports.mwValidateRegister = (req, res, next) => {
    const {
        role,
        name,
        email,
        cpf,
        birthday,
        phone,
        clientUserData,
        clientAdminData,
    } = req.body;
    const isCpfValid = new CPF().validate(cpf);

    // valid assertions:
    // Considering CPF as ID, these are true:
    // IMPORTANT: This requires another condition to identify if there is more than one account registered.account
    // THEN create a panel when the user login which he/she will choose which account to enter.
    // * achiever can register one cli-admin account and register one account in other fiddelize's accounts as a cli-user.
    // * cli-admin still not allowed to create multiple businesses's account (Only if compare the business name too)
    // e.g after finding a doc from queryCliadmin, verify if the bizName is the same:
    // if(user && user.cpf === cpf) { clientAdminData.bizName ===  currBizName  // user.bizPlan === "free"} // THIS WILL RETURN BAD REQUEST
    // * cli-admin can not have a cli-user account;
    // * a cli-user can have a cli-admin;
    // const queryCliAdmin = { $and: [cpf, {role: "cliente-admin"}] }
    // const queryCliUser = { $and: [cpf, bizId]}
    // let query = handleRoles(role, {cliAdmin: queryCliAdmin, cliUser: queryCliUser});
    User.findOne({ cpf: jsEncrypt(cpf) })
        .then((user) => {
            // profile validation
            // This CPF will be modified because this will be cheched according to roles..
            if (user && user.cpf === jsEncrypt(cpf))
                return res.status(400).json(msg("error.cpfAlreadyRegistered"));
            if (!name && !email && !cpf && !phone)
                return res.status(400).json(msg("error.anyFieldFilled"));
            if (!name) return res.status(400).json(msg("error.noName"));
            if (!isValidName(name))
                return res.status(400).json(msg("error.invalidLengthName"));
            if (role === "cliente-admin") {
                if (!clientAdminData.bizName)
                    return res
                        .status(400)
                        .json({ msg: "Informe o nome de sua empresa/projeto" });
            }
            if (!cpf) return res.status(400).json(msg("error.noCpf"));
            if (!email) return res.status(400).json(msg("error.noEmail"));
            if (!phone) return res.status(400).json(msg("error.noPhone"));
            if (!birthday) return res.status(400).json(msg("error.noBirthday"));
            if (!validateEmail(email))
                return res.status(400).json(msg("error.invalidEmail"));
            if (!isCpfValid)
                return res.status(400).json(msg("error.invalidCpf"));
            if (!validatePhone(phone))
                return res.status(400).json(msg("error.invalidPhone"));
            // end profile validation
            //if(reCaptchaToken) return res.status(400).json(msg('error.noReCaptchaToken'));
            // Request to restrict 10 registers only for free accounts.

            // if(user && user.name === name.toLowerCase()) return res.status(400).json(msg('error.userAlreadyRegistered')); // disable this until implementation of finding by bizId with { $and: [{ name }, { bizId }] }
            next();
        })
        .catch((err) => msgG("error.systemError", err));
};

function runTestException(cpf, user, req, next) {
    // For testing purpose, it will be allowed:]
    // 111.111.111-11 for cli-admin free version testing
    // 222.222.222-22 for cli-user free version testing
    if (
        cpf === "111.111.111-11" ||
        cpf === "222.222.222-22" ||
        cpf === "333.333.333-33"
    ) {
        req.profile = user;
        next();
        return true;
    }
    return false;
}

exports.mwValidateLogin = (req, res, next) => {
    const { cpf, roleWhichDownloaded } = req.body;
    const isCpfValid = new CPF().validate(cpf);

    User.findOne({ cpf: jsEncrypt(cpf) })
        .then((user) => {
            if (!cpf) return res.status(400).json(msg("error.noCpf"));
            const detected = runTestException(cpf, user, req, next);
            if (detected) return;
            if (!isCpfValid)
                return res.status(400).json(msg("error.invalidCpf"));
            if (!user) return res.status(400).json(msg("error.notRegistedCpf"));
            // this following condition is essencial for the moment to avoid conflicts between account login switch.
            const appType = user.role === "cliente-admin" ? "ADMIN" : "CLIENTE";
            if (roleWhichDownloaded && roleWhichDownloaded !== user.role)
                return res
                    .status(400)
                    .json(msg("error.differentRoles", appType));

            req.profile = user;
            next();
        })
        .catch((err) => msgG("error.systemError", err));
};

exports.mwValidatePassword = (req, res, next) => {
    const { password } = req.body;
    if (!password) return res.status(400).json(msg("error.noPassword"));
    if (password.length < 6)
        return res.status(400).json(msg("error.notEnoughCharacters"));
    if (!validatePassword(password))
        return res.status(400).json(msg("error.noDigitFound"));
    next();
};

exports.mwValidateEmail = (req, res, next) => {
    const { email } = req.body;
    if (!email) return res.status(400).json(msg("error.noEmail"));
    if (!validateEmail(email))
        return res.status(400).json(msg("error.invalidEmail"));
    next();
};
