exports.showConfirmTemplate = reqBody => {
    const { name, bizName, bizWebsite, bizInstagram } = reqBody;
    const client = name.cap();
    return({
        subject: `${client}, acumule pontos e ganhe produtos e serviços`,
        html: `
            <center>
                <header">
                     <img
                        style="box-shadow: 0 19px 38px rgba(0,0,0,0.20), 0 15px 12px rgba(0,0,0,0.12);"
                        src="https://i.imgur.com/XdDK2cy.png" width="500px" height="200px"/>
                </header>
            </center>
            <br />
            <h3 style="text-align: justify">Você está recebendo este email porque você foi cadastrado(a) com sucesso
            <br /> em nosso plano de fidelidade em <a href=${bizWebsite}></a>${bizWebsite}</h3>
            <h3>Siga nosso Instagram: <a href=${bizInstagram}></a>${bizInstagram}</h3>
            <footer>
                <h4 style="color: #e84393; font-weight: bold"><center>${bizName} ${new Date().getFullYear()}</center></h4>
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