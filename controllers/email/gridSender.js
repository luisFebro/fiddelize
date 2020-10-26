const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SEND_GRID_KEY);

module.exports = async ({ content }) => {
    const { toEmail, mainTitle } = content;

    const handleTo = () => {
        if (!toEmail) return process.env.EMAIL_DEV;
        return [toEmail]; // process.env.EMAIL_DEV take EMAIL_DEV away if there is more than 50 emails a day.
    };

    const contacts = {
        isMultiple: true, // the recipients can't see the other ones when this is on
        from: `${mainTitle} <${process.env.EMAIL_BIZ}>`,
        to: handleTo(),
    };

    const emailContent = Object.assign({}, content, contacts);
    return await sgMail.send(emailContent);
};
