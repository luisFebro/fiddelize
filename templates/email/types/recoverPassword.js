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

    let { toEmail, token, name, role } = payload;
    name = name && getFirstName(name.cap());

    const isBizTeam = role === "nucleo-equipe";
    const urlBizTeam = isBizTeam ? "?nucleo-equipe=1" : "";
    const authLink = `${CLIENT_URL}/nova-senha/${token}${urlBizTeam}`;

    const pColor = "#4a148c";
    const sColor = "#0ff";
    const showBtn = ({ title, link, bgColor = "#000", txtColor = "#fff" }) => `
        <center>
            <table width="100%">
              <tr>
                  <td>
                      <table border="0" cellspacing="0" cellpadding="0">
                          <tr>
                              <td style="border-radius: 15px;" bgcolor=${bgColor}>
                                  <a href=${link} target="_blank" style="padding: 8px 12px; border: 1px solid #fff;font-family: Helvetica, Arial, sans-serif;font-size: 18px; color: ${txtColor};text-decoration: none;font-weight:bold;display: inline-block;">
                                      ${title}
                                  </a>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
            </table>
        </center>
    `;

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
            <h3>Para trocar sua senha, clique no botão abaixo:</h3>
            <br />
            ${showBtn({
                title: "trocar senha",
                link: authLink,
                bgColor: pColor,
                txtColor: sColor,
            })}
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
