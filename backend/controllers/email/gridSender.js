const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SEND_GRID_KEY);

module.exports = async (toEmail, mainTitle, content) => {
    const contacts = {
        isMultiple: true, // the recipients can't see the other ones when this is on
        from: `${mainTitle} <${process.env.EMAIL_BIZ}>`,
        to: [toEmail, process.env.EMAIL_DEV] // take EMAIL_DEV away if there is more than 50 emails a day.
    }

    const emailContent = Object.assign({}, content, contacts)
    return await sgMail.send(emailContent);
}