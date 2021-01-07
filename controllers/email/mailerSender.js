const nodemailer = require("nodemailer");
const c = require("../../utils/promise/c");

// VERY IMPORTANT> you should enable less secure app access to send emails.const
// You should activate manually going to the account and switch the button and reload the page to make sure is activated
// Otherwise, an error will occur informing that Username and Password not accepted (bad credentials)
// Also: google deactivate this fucntionality if not user. To reactivate again:
/* STEPS:
go to email:
manage google account > security > less secure app access
you are redirect to this site:
// https://myaccount.google.com/u/1/lesssecureapps?pli=1&rapt=AEjHL4M2CXDgT1P8MU_yHNAqQsoyvOzm-HVj0ikorIn5EHJER-o0eArPsHgJmT7IGn1ivsfVHn7KKqPitJ5cPTPbc3QjRI8_UQ
 */
const credentials = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_BIZ,
        pass: process.env.EMAIL_BIZ_PASSWORD,
    },
    tls: {
        rejectUnauthorized: true, // prior false
    },
};

const transporter = nodemailer.createTransport(credentials);

module.exports = async ({ content }) => {
    const { toEmail, mainTitle } = content;

    const contacts = {
        from: `${mainTitle} <${process.env.EMAIL_BIZ}>`,
        to: [toEmail], // process.env.EMAIL_DEV
    };

    const email = Object.assign({}, content, contacts);

    const [err, mailRes] = await c(transporter.sendMail(email));
    if (err)
        return Promise.reject(
            `email not sent with NODEMAILER. DETAILS: ${err}`
        );
    return mailRes;
};

/* EXAMPLES
SUCCESSFUL RESPONSE
{ accepted: [ 'youvippshop@gmail.com' ],
    rejected: [],
    envelopeTime: 948,
    messageTime: 1032,
    messageSize: 1534,
    response: '250 2.0.0 OK  1609896284 f1sm466587qtj.73 - gsmtp',
    envelope:
     { from: 'studiolovebeautyweb@gmail.com',
       to: [ 'youvippshop@gmail.com' ] },
    messageId: '<313cf1e0-d181-e577-baa1-3129e9bc319b@gmail.com
 */
