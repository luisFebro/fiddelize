const User = require("../../models/user");
const validateEmail = require("../../utils/validation/validateEmail");
const validatePhone = require("../../utils/validation/validatePhone");
const isValidName = require("../../utils/validation/isValidName");
const CPF = require("../../utils/validation/validateCpf");
const { msg } = require("../_msgs/auth");
const { msgG } = require("../_msgs/globalMsgs");
const { jsEncrypt } = require("../../utils/security/xCipher");
const checkValidSequence = require("./algorithms/checkValidSequence");
const {
    checkAccountLimit,
    checkIfAlreadyHasUser,
} = require("./helpers/validateRegister");

const CPF_TEST = "111.111.111-00";

exports.mwValidateRegister = async (req, res, next) => {
    const {
        role,
        name,
        email,
        cpf,
        birthday,
        phone,
        gender,
        clientAdminData,
        isInstantAccount,
    } = req.body;

    const { accounts } = await req.getAccount(null, { cpf, accounts: true });

    const error = checkAccountLimit(accounts, { currRole: role });
    if (error) return res.status(401).json({ error });

    if (!isInstantAccount && (role === "cliente" || role === "cliente-admin")) {
        const {
            statusVal: userExists,
            duplicateNameMsg,
        } = await checkIfAlreadyHasUser(req.body);
        if (duplicateNameMsg)
            return res.status(401).json({ error: duplicateNameMsg });
        if (userExists) {
            const targetRole = role === "cliente" ? "cliente" : "admin";
            return res.status(401).json({
                error: `Não foi possível cadastrar com este CPF no app do ${targetRole} nesta empresa`,
            });
        }
    }

    if (!isInstantAccount) {
        // profile validation
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

        const isCpfValid = new CPF().validate(cpf);
        if (!isCpfValid) return res.status(400).json(msg("error.invalidCpf"));

        if (!validatePhone(phone))
            return res.status(400).json(msg("error.invalidPhone"));
        if (gender === "selecione forma tratamento")
            return res
                .status(400)
                .json({ error: "Selecione uma forma de tratamento" });
        // end profile validation
        //if(reCaptchaToken) return res.status(400).json(msg('error.noReCaptchaToken'));
    } else {
        if (!cpf) return res.status(400).json(msg("error.noCpf"));
        if (cpf !== CPF_TEST) {
            const isCpfValid = new CPF().validate(cpf);
            if (!isCpfValid)
                return res.status(400).json(msg("error.invalidCpf"));
        }
    }

    req.accountsNumber = accounts && accounts.length; // for decide whether only update the accounts list if got already at least one account.

    next();
};

exports.mwValidateLogin = async (req, res, next) => {
    const { cpf, roleWhichDownloaded } = req.body;
    const isCpfValid = new CPF().validate(cpf);

    const { role } = await req.getAccount(null, { cpf });
    console.log("role", role);

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
            if (roleWhichDownloaded && roleWhichDownloaded !== user.role)
                return res
                    .status(400)
                    .json(msg("error.differentRoles", appType));

            req.profile = user;
            next();
        })
        .catch((err) => {
            console.log(err);
        });
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
    // 111.111.111-00 is the official account for all apps version testing
    if (cpf === CPF_TEST) {
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
