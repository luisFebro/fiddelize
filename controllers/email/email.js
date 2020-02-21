const User = require('../../models/user');
const mailerSender = require('./mailerSender');
const gridSender = require('./gridSender');
const uuidv1 = require('uuid/v1');
const { msgG } = require('../_msgs/globalMsgs');
const { msg } = require('../_msgs/email');
const {
    showConfirmTemplate,
    showNewPassLinkTemplate,
} = require('../../templates/email');
const { CLIENT_URL } = require('../../config');

// MIDDLEWARES
exports.mwGetLinkChangePass = (req, res, next) => {
    const { email } = req.body;
    User.findOneAndUpdate(
    { email },
    { $set: {"tempAuthUserToken.this": `${uuidv1()}np`}},// np = new password
    { new: true },
    (err, user) => {
        if(err) return res.status(400).json(msg('error.systemError', err.toString()))
        if(!user) return res.status(400).json(msg('error.notRegistered'))
        const authToken = user.tempAuthUserToken.this;
        const userId = user._id;
        const authLink = `${CLIENT_URL}/cliente/trocar-senha/${authToken}?id=${userId}`
        req.email = {
            authLink,
            userName: user.name
        }

        next();
    })
}

exports.mwGetLinkConfirm = (req, res, next) => {
    const { authId } = req.params;
    User.findOne({ _id: authId })
    .exec((err, user) => {
        if(err) return res.status(400).json(msg('error.systemError', err.toString()))
        const userId = user._id;
        const authLink = `${CLIENT_URL}/cliente/confirmacao-conta/${userId}`
        req.email = {
            authLink,
        }

        next();
    })

}
// END MIDDLEWARES


// SEND EMAIL
const sendEmail = async (toEmail, mainTitle, content) => {
    try {
        await gridSender(toEmail, mainTitle, content)
        console.log(msg('ok.sentGrid', 'onlyMsg'));
    } catch(err) {
        console.error(msg('error.notSent', err.toString(), 'onlyMsg'));
        if(err.toString().includes("Maximum credits exceeded")) {
            mailerSender(toEmail, mainTitle, content)
            .then(res => console.log(msg('ok.sentMailer', 'onlyMsg')))
            .catch(err => console.log("error.notSent", err.toString()))
        }
    }
}
// END SEND EMAIL

exports.sendWelcomeConfirmEmail = (req, res) => {
    const { email, bizName } = req.body;
    const mainTitle = `${bizName} - Plano de Fidelidade`;
    sendEmail(email, mainTitle, showConfirmTemplate(req.body))
    .then(() => res.json(msg('ok.confirm')))
    .catch(err => res.json(msgG('error.systemError', err)))
}

exports.sendNewPasswordEmail = (req, res) => {
    const { email, bizName } = req.body;
    const mainTitle = `${bizName} - Recuperação de acesso`;

    sendEmail(email, mainTitle, showNewPassLinkTemplate(req.email, req.body))
    .then(() => res.json(msg('ok.sentNewPassLinkEmail')))
    .catch(err => res.json(msgG('error.systemError', err)))
}



/* COMMENTS
n1: // if any blocking condition is true, then "ok" will be the word to allow sending the email
*/

// EXEMPLE
// const User = require('../user.model')
// The callback that is invoked when the user submits the form on the client.
// exports.collectEmail = (req, res) => {
//   const { email } = req.body

//   User.findOne({ email })
//     .then(user => {

//       // We have a new user! Send them a confirmation email.
//       if (!user) {
//         User.create({ email })
//           .then(newUser => sendEmail(newUser.email, templates.confirm(newUser._id)))
//           .then(() => res.json({ msg: msgs.confirm }))
//           .catch(err => console.log(err))
//       }

//       // We have already seen this email address. But the user has not
//       // clicked on the confirmation link. Send another confirmation email.
//       else if (user && !user.confirmed) {
//         sendEmail(user.email, templates.confirm(user._id))
//           .then(() => res.json({ msg: msgs.resend }))
//       }

//       // The user has already confirmed this email address
//       else {
//         res.json({ msg: msgs.alreadyConfirmed })
//       }

//     })
//     .catch(err => console.log(err))
// }

// // The callback that is invoked when the user visits the confirmation
// // url on the client and a fetch request is sent in componentDidMount.
// exports.confirmEmail = (req, res) => {
//   const { id } = req.params

//   User.findById(id)
//     .then(user => {

//       // A user with that id does not exist in the DB. Perhaps some tricky
//       // user tried to go to a different url than the one provided in the
//       // confirmation email.
//       if (!user) {
//         res.json({ msg: msgs.couldNotFind })
//       }

//       // The user exists but has not been confirmed. We need to confirm this
//       // user and let them know their email address has been confirmed.
//       else if (user && !user.confirmed) {
//         User.findByIdAndUpdate(id, { confirmed: true })
//           .then(() => res.json({ msg: msgs.confirmed }))
//           .catch(err => console.log(err))
//       }

//       // The user has already confirmed this email address.
//       else  {
//         res.json({ msg: msgs.alreadyConfirmed })
//       }

//     })
//     .catch(err => console.log(err))
// }