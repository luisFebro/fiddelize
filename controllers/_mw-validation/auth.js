const User = require("../../models/user");
const validateEmail = require("../../utils/validation/validateEmail");
const validatePhone = require("../../utils/validation/validatePhone");
const isValidName = require("../../utils/validation/isValidName");
const CPF = require("../../utils/validation/validateCpf");
const { msg } = require("../_msgs/auth");
const { msgG } = require("../_msgs/globalMsgs");
const { jsEncrypt } = require("../../utils/security/xCipher");
const checkValidSequence = require("../../utils/biz-algorithms/password/checkValidSequence");
const checkAccountLimit = require("./helpers/checkAccountLimit");

// const handleRoles = (currRoles, rolesQueryObj) => {
//     const { cliAdmin, cliUser } = rolesQueryObj;
//     switch (currRoles) {
//         case "cliente":
//             return cliUser;
//         case "cliente-admin":
//             return cliAdmin;
//         default:
//             console.log("somehtign wrong in handleRoles");
//     }
// };
// const getBizId = (body) => {
//     const { clientUserData, clientMemberData } = body;
//     return clientUserData && clientUserData.bizId || clientMemberData && clientMemberData.bizId;
// }

exports.mwValidateRegister = async (req, res, next) => {
    const {
        role,
        name,
        email,
        cpf,
        birthday,
        phone,
        clientAdminData,
    } = req.body;

    const { accounts } = await req.getAccount(null, { cpf, accounts: true });

    const error = checkAccountLimit(accounts);
    if (error) return res.status(401).json({ error });

    const isCpfValid = new CPF().validate(cpf);

    // valid assertions:
    // * a cli-user can have a cli-admin;
    // const queryCliAdmin = { $and: [cpf, {role: "cliente-admin"}] }
    // const queryCliUser = { $and: [cpf, bizId]}
    // let query = handleRoles(role, {cliAdmin: queryCliAdmin, cliUser: queryCliUser});
    const user = await User(role)
        .findOne({ cpf: jsEncrypt(cpf) })
        .catch((err) => {
            msgG("error.systemError", err);
        });

    // profile validation
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
    if (!isCpfValid) return res.status(400).json(msg("error.invalidCpf"));
    if (!validatePhone(phone))
        return res.status(400).json(msg("error.invalidPhone"));
    // end profile validation
    //if(reCaptchaToken) return res.status(400).json(msg('error.noReCaptchaToken'));
    next();
};

exports.mwValidateLogin = (req, res, next) => {
    const { cpf, roleWhichDownloaded: role } = req.body;
    const isCpfValid = new CPF().validate(cpf);

    User(role)
        .findOne({ cpf: jsEncrypt(cpf) })
        .then((user) => {
            if (!cpf) return res.status(400).json(msg("error.noCpf"));
            const detected = runTestException(cpf, { user, req });
            if (detected) return next();
            if (!isCpfValid)
                return res.status(400).json(msg("error.invalidCpf"));
            if (!user) return res.status(400).json(msg("error.notRegistedCpf"));
            // this following condition is essencial for the moment to avoid conflicts between account login switch.
            const appType = user.role === "cliente-admin" ? "ADMIN" : "CLIENTE";
            if (role && role !== user.role)
                return res
                    .status(400)
                    .json(msg("error.differentRoles", appType));

            req.profile = user;
            next();
        })
        .catch((err) => msgG("error.systemError", err));
};

exports.mwValidatePassword = (req, res, next) => {
    const { pswd, newPswd, newPswd2, checkToken } = req.body;
    if (checkToken) return next();

    if (!pswd && !newPswd)
        return res
            .status(400)
            .json({ error: "Digite senha numérica de 6 dígitos" }); // not validated though since only requested if user fills every digit

    const thisPswd = newPswd2 || newPswd || pswd;
    const { result, msg } = checkValidSequence(thisPswd);
    if (!result) return res.status(400).json({ error: msg });

    next();
};

exports.mwValidateEmail = (req, res, next) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ error: "Por favor, insira o seu CPF" });
    if (!validateEmail(email))
        return res
            .status(400)
            .json({ error: "Email informado é inválido. Tente novamente." });
    next();
};

exports.mwValidateCPF = (req, res, next) => {
    const { cpf } = req.body;

    const detected = runTestException(cpf);
    if (detected) return next();
    const isCpfValid = new CPF().validate(cpf);

    if (!cpf) return res.status(400).json({ error: "Informe seu CPF." });
    if (!isCpfValid)
        return res.status(400).json({ error: "CPF informado é inválido." });

    next();
};

// HELPERS
function runTestException(cpf, options = {}) {
    const { user, req } = options;
    // For testing purpose, it will be allowed:]
    // 111.111.111-11 for cli-admin free version testing
    // 222.222.222-22 for cli-user free version testing
    if (
        cpf === "111.111.111-11" ||
        cpf === "222.222.222-22"
        // cpf === "333.333.333-33"
    ) {
        if (user && req) req.profile = user;
        return true;
    }
    return false;
}
// END HELPERS

/* ARCHIVES
 const { password } = req.body;
    if (!password) return res.status(400).json(msg("error.noPassword"));
    if (password.length < 6)
        return res.status(400).json(msg("error.notEnoughCharacters"));
    if (!validatePassword(password))
        return res.status(400).json(msg("error.noDigitFound"));
 */
