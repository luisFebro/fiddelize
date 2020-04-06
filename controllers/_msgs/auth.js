const authMsgs = { ok: {}, error: {}};
const { ok, error } = authMsgs;

const msg = (typeAndMsgName, customized = 'NeedCustomWord', options) => {
    const isOnlyMsg = `${customized}${options}`.includes("onlyMsg");

    const checkIfNotString = typeof customized !== 'string';
    checkIfNotString
    ? customized = JSON.stringify(customized).cap()
    : customized = customized.cap()

    const [type, msgName] = typeAndMsgName.split(".");
    let foundMsg;

    // MESSAGES
    ok.welcomeBack = `Olá de volta, ${customized}`;
    ok.successRegister = `${customized}, cadastro realizado com sucesso. Você já está participando do nosso plano de fidelidade. Agradecemos sua visita!`;
    ok.changedPassword = `Sua senha foi alterada com sucesso, ${customized}!`;
    error.jwtNotFound = "JWT token não foi encontrado";
    error.sessionEnded = 'A sua sessão terminou.';
    error.notAuthorized = "Você não tem autorização para acessar este documento";
    error.accessDenied = "Acesso Negado. Somente admin";
    error.expiredAuthToken = 'O prazo para trocar a senha expirou.';
    error.noAuthToken = 'Não foi encontrado nenhuma solicitação de mudança de senha';
    error.differentRoles = `Essa conta tipo ${customized} não tem acesso a esse App`;
    // Form
    error.anyFieldFilled = "Você precisa preencher todos os campos";
    error.noDigitFound = 'Sua senha deve conter pelo menos um dígito';
    error.noName = 'Por favor, insira o seu nome';
    error.noBizName = 'Por favor, insira o nome do seu projeto/empresa';
    error.noPassword = 'Por favor, insira uma senha';
    error.noCpf = 'Por favor, insira o seu CPF';
    error.noBirthday = 'Por favor, insira o DIA e MÊS do seu aniversário';
    error.noEmail = 'Por favor, insira o seu email';
    error.noPhone = 'Por favor, insira um número para contato';
    error.noEmailOrName = 'Por favor, insira o seu email ou nome';
    error.noReCaptchaToken = "Último passo. Clique na caixa do Google ReCaptcha"
    error.notFound = "Sem registro. O usuário ou email não foi encontrado";
    error.notEnoughCharacters = 'Sua senha deve conter pelo menos 6 dígitos';
    error.notRegistedCpf = "O CPF informado ainda não possui cadastro";
    error.invalidEmail = "Email Inválido. Tente outro.";
    error.invalidLengthName = "Seu nome precisa conter um sobrenome também";
    error.invalidCredentials = "Credenciais Inválidas. Se for o caso, tente colocar em minúsculas";
    error.invalidPhone = "Formato telefone inválido. Digita de 10 a 11 dígitos com DDD. ex: 95977779999"
    error.invalidCpf = "O CPF informado não é válido.";
    error.userAlreadyRegistered = 'Esse NOME já foi registrado. Tente adicionar outro sobrenome.';
    error.emailAlreadyRegistered = 'Esse EMAIL já foi registrado. Tente um outro.';
    error.cpfAlreadyRegistered = 'Esse CPF já foi cadastrado.'; // Security Vulnability - do not narrow down about each issue was rejected: Esse CPF já foi registrado. Tente um outro.
    // END MESSAGES

    foundMsg = authMsgs[type][msgName];
    const needThrowErr = foundMsg.includes('NeedCustomWord');
    if(needThrowErr) throw new Error('It is required a customized string');

    if(isOnlyMsg) return foundMsg;
    return ({ msg: foundMsg });
}

module.exports = {
    msg
}
