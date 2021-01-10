const { CLIENT_URL } = require("../../../config");
const APP_NAME = process.env.APP_NAME;
//const getFirstName = require("../../../utils/string/getFirstName");

// email to alert when user enter in one of payment methods.
//  for pix, credit card and bank debit.
//  boleto option pagseguro is sending without failing everytime one is generated.

/*
should inform:
- bizId (OK)
- cliName (Ok)
- amount (OK)
- payment details (OK)
- services description (OK)
 */

exports.payAlert = (payload) => {
    if (!payload) return false;

    let {
        payMethod,
        amount,
        cliName,
        servDesc,
        bizName,
        toEmail,
        reference,
    } = payload;

    return {
        toEmail,
        mainTitle: `R$ ${amount}: Pedido via ${payMethod} - ${APP_NAME}`,
        subject: `${servDesc} pelo cliente ${cliName}`,
        html: `
            <center>
                <header">
                     <img width="250px" height="auto" src="https://i.imgur.com/JlNXRin.png" />
                </header>
            </center>
            <h1>Detalhes da intenção de investimento via ${payMethod}:</h1>

            <h2>Valor Investimento:</h2>
            <p style="font-weight:bold;">- R$ ${amount}</p>

            <h2>Cliente:</h2>
            <p style="font-weight:bold;">-${cliName}</p>

            <h2>Serviços:</h2>
            <p style="font-weight:bold;">-${servDesc}</p>

            <h2>Referência:</h2>
            <p style="font-weight:bold;">-${reference}</p>

            <h2>Nome Negócio:</h2>
            <p style="font-weight:bold;">-${bizName}</p>

            <footer>
                <h4>Lembrando que para pagamentos PIX é semiautomático e precisa ativar os serviços dos clientes em até 12 horas.</h5>
                <h4 class="font-weight: italic;">
                    Atenciosamente,
                    <br />
                    Equipe Fiddelize
                </h5>
            </footer>
        `,
    };
};
