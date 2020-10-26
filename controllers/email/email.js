const User = require("../../models/user");
const mailerSender = require("./mailerSender");
const gridSender = require("./gridSender");
const { CLIENT_URL } = require("../../config");
const pickTemplate = require("../../templates/email/pickTemplate");

const handleEmailProvider = async ({ content }) => {
    return await gridSender({ content }).catch(async (err) => {
        console.error(
            `ERROR: Email not sent! Details: ${err} End. || Trying with another provider...`
        );

        if (err.toString().includes("Maximum credits exceeded")) {
            // not working: Username and Password not accepted
            await mailerSender({ content }).catch((err) => {
                console.log(
                    `ERROR: email not sent with nodemailer. DETAILS: ${err}`
                );
            });

            res.json({
                msg: `Email successfully sent with nodeMailer`,
            });
            return undefined;
        }
    });
};

exports.sendEmail = async (req, res) => {
    const { type, payload } = req.body;

    if (!type || !payload)
        return res
            .status(400)
            .json({
                error: "Requires both email`s TYPE and PAYLOAD in the body",
            });
    // PAYLOADS
    // recoverPassword = toEmail, token, name

    const content = pickTemplate(type, { payload });

    const providerRes = await handleEmailProvider({ content }).catch((err) => {
        res.json({ error: `ERROR: ${err}` });
    });

    if (providerRes) {
        res.json({
            msg: `${type} mail sent successfully`,
        });
    }
};

exports.sendEmailBack = async ({ type, payload }) => {
    if (!type || !payload)
        return console.log(
            "Requires both email`s TYPE and PAYLOAD in the body"
        );

    const content = pickTemplate(type, { payload });

    const providerRes = await handleEmailProvider({ content }).catch(
        (err) => `ERROR: ${err}`
    );

    if (providerRes) {
        return `${type} mail sent successfully`;
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
