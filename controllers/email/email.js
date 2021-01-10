const mailerSender = require("./mailerSender");
const gridSender = require("./gridSender");
const { CLIENT_URL } = require("../../config");
const pickTemplate = require("../../templates/email/pickTemplate");
const c = require("../../utils/promise/c");

const handleEmailProvider = async ({
    content,
    toEmail,
    priority = "mailer",
}) => {
    const priorities = ["grid", "mailer"];
    if (!priorities.includes(priority))
        return Promise.reject(`priority should be: ${priorities}`);

    if (priority === "grid") {
        const [senderErr, answer] = await c(gridSender({ content }));
        if (senderErr) {
            const [mailerErr, mailerRes] = await c(mailerSender({ content }));
            if (mailerErr)
                return Promise.reject(`${mailerErr}. sendGrid also failed!`);
            return { secondTry: true, provider: "nodeMailer", sentTo: toEmail };
        }
        return { provider: "sendgrid", sentTo: toEmail };
    }

    if (priority === "mailer") {
        const [mailerErr, mailerRes] = await c(mailerSender({ content }));
        if (mailerErr) {
            const [senderErr] = await c(gridSender({ content }));
            if (senderErr)
                return Promise.reject(`${senderErr}. nodeMailer also failed!`);
            return { secondTry: true, provider: "nodeMailer", sentTo: toEmail };
        }
        return { provider: "nodeMailer", sentTo: toEmail };
    }
};

exports.sendEmail = async (req, res) => {
    const { type, priority, payload } = req.body;

    if (!type || !payload)
        return res.status(400).json({
            error: "Requires both email`s TYPE and PAYLOAD in the body",
        });
    // PAYLOADS
    // recoverPassword = toEmail, token, name

    const [templateErr, content] = await c(pickTemplate(type, { payload }));
    if (templateErr) return res.status(400).json({ error: `${templateErr}` }); // LESSON: use templates string. Otherwise it will produce error like this: {}

    const [providerErr, providerRes] = await c(
        handleEmailProvider({ content, priority, toEmail: payload.toEmail })
    );
    if (providerErr) return res.status(400).json({ error: providerErr });

    const { provider, sentTo } = providerRes;

    res.json({
        msg: `Email sent successfully`,
        type,
        provider,
        sentTo,
    });
};

exports.sendEmailBack = async ({ type, priority, payload }) => {
    if (!type || !payload)
        return Promise.reject(
            "Requires both email`s TYPE and PAYLOAD in the body"
        );

    const [templateErr, content] = await c(pickTemplate(type, { payload }));
    if (templateErr) return Promise.reject(templateErr);

    const [providerErr, providerRes] = await c(
        handleEmailProvider({ content, priority, toEmail: payload.toEmail })
    );
    if (providerErr) return Promise.reject(providerErr);

    const { provider, sentTo } = providerRes;
    if (providerRes) {
        return `mail sent to ${sentTo} successfully with ${providerRes}`;
    }
};

/* COMMENTS
n1: // if any blocking condition is true, then "ok" will be the word to allow sending the email
*/

/*
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

 */
