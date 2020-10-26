const nodemailer = require("nodemailer");

const credentials = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_BIZ,
        pass: process.env.EMAIL_BIZ_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
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
    return await transporter.sendMail(email);
};
