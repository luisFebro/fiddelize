const User = require('../../models/user');
const validateEmail = require('../../utils/validation/validateEmail');
const validatePhone = require('../../utils/validation/validatePhone');
const isValidName = require('../../utils/validation/isValidName');
const CPF = require('../../utils/validation/validateCpf');
const { msg } = require('../_msgs/auth');
const { msgG } = require('../_msgs/globalMsgs');

exports.mwValidateRegister = (req, res, next) => {
    const { role, name, email, cpf, birthday, phone } = req.body;
    const isCpfValid = new CPF().validate(cpf);

    User.findOne({ name })
    .then(user => { // the search should includename and business to narrow down
        if(user && user.name === name.toLowerCase()) return res.status(400).json(msg('error.userAlreadyRegistered'));
        if(!name && !email && !cpf && !phone) return res.status(400).json(msg('error.anyFieldFilled'));
        if(!name) return res.status(400).json(msg('error.noName'));
        if(!isValidName(name)) return res.status(400).json(msg('error.invalidLengthName'));
        User.findOne({ cpf })
        .then(user3 => {
            if(user3 && user3.cpf === cpf) return res.status(400).json(msg('error.cpfAlreadyRegistered'));
            if(!cpf) return res.status(400).json(msg('error.noCpf'));
            if(!email) return res.status(400).json(msg('error.noEmail'));
            if(!phone) return res.status(400).json(msg('error.noPhone'));
            if(!birthday) return res.status(400).json(msg('error.noBirthday'));
            if(!validateEmail(email)) return res.status(400).json(msg('error.invalidEmail'));
            if(!isCpfValid) return res.status(400).json(msg('error.invalidCpf'));
            if(!validatePhone(phone)) return res.status(400).json(msg('error.invalidPhone'));
            //if(reCaptchaToken) return res.status(400).json(msg('error.noReCaptchaToken'));

            // client admin validaiton // nOT FUCKIN WORKING !!!
            // console.log(role === "cliente-admin");
            // if(role === "cliente-admin") {
            //     const thisBizName = user.clientAdminData.bizName;
            //     console.log("thisBizName", thisBizName);
            //     if(thisBizName) return res.status(400).json(msg('error.noName'));
            // }
            next();
        }).catch(err => msgG('error.systemError', err));
    }).catch(err => msgG('error.systemError', err));
}

exports.mwValidateLogin = (req, res, next) => {
    const { cpf, roleWhichDownloaded } = req.body;
    const isCpfValid = new CPF().validate(cpf);

    User.findOne({ cpf })
    .then(user => {
        if(!cpf) return res.status(400).json(msg('error.noCpf'));
        if(!isCpfValid) return res.status(400).json(msg('error.invalidCpf'));
        if(!user) return res.status(400).json(msg('error.notRegistedCpf'));
        const appType = user.role === "cliente-admin" ? "ADMIN" : "CLIENTE"
        if(roleWhichDownloaded && roleWhichDownloaded !== user.role) return res.status(400).json(msg('error.differentRoles', appType))
        req.profile = user;
        next();
    })
    .catch(err => msgG('error.systemError', err));
}

exports.mwValidatePassword = (req, res, next) => {
    const { password } = req.body;
    if(!password) return res.status(400).json(msg('error.noPassword'));
    if(password.length < 6) return res.status(400).json(msg('error.notEnoughCharacters'))
    if(!validatePassword(password)) return res.status(400).json(msg('error.noDigitFound'))
    next();
}

exports.mwValidateEmail = (req, res, next) => {
    const { email } = req.body;
    if(!email) return res.status(400).json(msg('error.noEmail'));
    if(!validateEmail(email)) return res.status(400).json(msg('error.invalidEmail'));
    next();
}