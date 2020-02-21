exports.showConfirmTemplate = (reqEmail, reqBody) => {
    const { authLink } = reqEmail;
    const { name, bizName, bizWebsite, bizWhatsapp, bizSlogon } = reqBody;
    const client = name.cap();
    return({
        subject: `${client}, confirme a sua conta da ${bizName}`,
        html: `
            <center>
                <header">
                     <img style="box-shadow: 0 19px 38px rgba(0,0,0,0.20), 0 15px 12px rgba(0,0,0,0.12);" src="https://imgur.com/9GjtAiW.png" width="200px" height="200px"/>
                </header>
            </center>
            <h1><center>${bizSlogon}</center></h1>
            <h3>Tenha acesso a todos as funcionalidades da ${bizName}</h3>
            <h3>Para ativar sua conta, por favor verifique seu endereço de email:</h3>
            <h4><a href=${authLink}>CONFIRMAR SEU EMAIL</a></h4>
            <h4>Ou acesse pelo link: <a href=${authLink}>${authLink}</a></h4>
            <footer>
                <h5>Se você tiver qualquer dúvida, entre em contato com nosso <strong>Whatsapp ${bizWhatsapp}</strong> ou responda a esse email que ficaremos contentes em ajudar.</h5>
            </footer>
        `
    })

};

exports.showNewPassLinkTemplate = (reqEmail, reqBody) => {
    const { email, bizName, bizSlogon } = reqBody;
    const { authLink, userName } = reqEmail;
    const client = userName.cap();
    return({
        subject: `${client}, aqui estão instruções para ter seu novo acesso a sua conta da ${bizName}`,
        html: `
            <center>
                <header">
                     <img style="box-shadow: 0 19px 38px rgba(0,0,0,0.20), 0 15px 12px rgba(0,0,0,0.12);" src="https://imgur.com/9GjtAiW.png" width="200px" height="200px"/>
                </header>
            </center>
            <h1><center>${bizSlogon}</center></h1>
            <h3>Para trocar sua senha, clique aqui em <a href=${authLink}>TROCAR SENHA</a> ou pelo seguinte link:</h3>
            <br />
            <h3><a href=${authLink}>${authLink}</a></h3>
            <br />
            <h4>Este link expira em 1 hora após solicitação.</h4>
            <footer>
                <h5>Você está recebendo este email após solicitação de recuperação de acesso pelo site da ${bizName}.</h5>
                <h5>Se não foi você que solicitou, ignore essa mensagem.</h5>
            </footer>
        `
    })

}









// Exemple
// This file is exporting an Object with a single key/value pair.
// However, because this is not a part of the logic of the application
// it makes sense to abstract it to another file. Plus, it is now easily
// extensible if the application needs to send different email templates
// (eg. unsubscribe) in the future.
// module.exports = {

//   confirm: id => ({
//     subject: 'React Confirm Email',
//     html: `
//       <a href='${CLIENT_ORIGIN}/confirm/${id}'>
//         click to confirm email
//       </a>
//     `,
//     text: `Copy and paste this link: ${CLIENT_ORIGIN}/confirm/${id}`
//   })