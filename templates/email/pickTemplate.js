const { recoverPassword } = require("./types/recoverPassword");
const { payAlert } = require("./types/payAlert");

const store = {
    recoverPassword,
    payAlert,
};

async function pickTemplate(type = "text", options = {}) {
    const { payload } = options;

    if (type === "text") {
        const { toEmail, mainTitle, subject, msg } = payload;
        if (!toEmail || !mainTitle || !subject || !msg)
            return Promise.reject(
                "PAYLOAD: missing toEmail, mainTitle, subject or msg"
            );

        return {
            toEmail,
            mainTitle: `${mainTitle}`,
            subject: `${subject}`,
            html: `
                <p>
                   ${msg}
                </p>
            `,
        };
    }

    const found = store[type];
    if (!found) return false;
    return found(payload);
}

module.exports = pickTemplate;
