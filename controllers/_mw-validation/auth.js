const User = require('../../models/user');
const validateEmail = require('../../utils/validation/validateEmail');
const validatePhone = require('../../utils/validation/validatePhone');
const isValidName = require('../../utils/validation/isValidName');
const CPF = require('../../utils/validation/validateCpf');
const { msg } = require('../_msgs/auth');
const { msgG } = require('../_msgs/globalMsgs');


exports.mwValidateRegister = (req, res, next) => {
    const { name, email, cpf, birthday, phone } = req.body;
    const isCpfValid = new CPF().validate(cpf);

    User.findOne({ name }).then(user2 => { // the search should includename and business to narrow down
        if(user2 && user2.name === name.toLowerCase()) return res.status(400).json(msg('error.userAlreadyRegistered'));
        User.findOne({ cpf })
        .then(user => {
            if(!name && !email && !cpf && !phone) return res.status(400).json(msg('error.anyFieldFilled'));
            if(!name) return res.status(400).json(msg('error.noName'));
            if(!isValidName(name)) return res.status(400).json(msg('error.invalidLengthName'));
            if(user && user.cpf === cpf) return res.status(400).json(msg('error.cpfAlreadyRegistered'));
            if(!cpf) return res.status(400).json(msg('error.noCpf'));
            if(!email) return res.status(400).json(msg('error.noEmail'));
            if(!phone) return res.status(400).json(msg('error.noPhone'));
            if(!birthday) return res.status(400).json(msg('error.noBirthday'));
            if(!validateEmail(email)) return res.status(400).json(msg('error.invalidEmail'));
            if(!isCpfValid) return res.status(400).json(msg('error.invalidCpf'));
            if(!validatePhone(phone)) return res.status(400).json(msg('error.invalidPhone'));
        })
        //if(reCaptchaToken) return res.status(400).json(msg('error.noReCaptchaToken'));
        next();
    })
    .catch(err => msgG('error.systemError', err));
}

exports.mwValidateLogin = (req, res, next) => {
    const { cpf } = req.body;
    const isCpfValid = new CPF().validate(cpf);

    User.findOne({ cpf })
    .then(user => {
        if(!cpf) return res.status(400).json(msg('error.noCpf'));
        if(!isCpfValid) return res.status(400).json(msg('error.invalidCpf'));
        if(!user) return res.status(400).json(msg('error.notRegistedCpf'));
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