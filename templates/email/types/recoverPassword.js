const { CLIENT_URL } = require("../../../config");
const APP_NAME = process.env.APP_NAME;
const getFirstName = require("../../../utils/string/getFirstName");
/*
Other email implementation's suggestions:
- preLogin or preSignup (to avoid fake accounts...)
- successful registration
 */

exports.recoverPassword = (payload) => {
    if (!payload) return false;

    let { toEmail, token, name } = payload;
    name = name && getFirstName(name.cap());

    const authLink = `${CLIENT_URL}/nova-senha/${token}`;

    return {
        toEmail,
        mainTitle: `Recuperação de senha - ${APP_NAME}`,
        subject: `${name}, aqui estão instruções para recuperar sua conta da ${APP_NAME}`,
        html: `
            <center>
                <header">
                     <img style="max-width: 400px;" src="https://imgur.com/YUdJbI2.png" width="100%" height="150px"/>
                </header>
            </center>
            <h3>Para trocar sua senha, clique aqui em <a href=${authLink}>TROCAR SENHA</a> ou pelo seguinte link:</h3>
            <br />
            <h3><a href=${authLink}>${authLink}</a></h3>
            <br />
            <h4>Por segurança, este link expira em 1 hora ou quando usado.</h4>
            <footer>
                <h5>Você está recebendo este email após solicitar recuperação de acesso pelo site ou app da ${APP_NAME}.</h5>
                <h5 class="font-weight: italic;">
                    Atenciosamente,
                    <br />
                    Equipe Fiddelize
                </h5>
            </footer>
        `,
    };
};
