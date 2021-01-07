const axios = require("axios");
const convertXmlToJson = require("../../../utils/promise/convertXmlToJson");
const { sandboxMode, payUrl, agentRegisterNotifyUrl } = require("../globalVar");
const { CLIENT_URL } = require("../../../config");
// https://dev.pagseguro.uol.com.br/reference/aplicacoes-introducao
// const User = require("../../../models/user");
// applications model from Pagseguro
// Após criar uma aplicação você poderá pedir a autorização do seu cliente para criar checkout, criar assinaturas, efetuar consultas entre outras ações
/* STEPS:
1 - Neste primeiro momento sua aplicação faz uma chamada para nossa API informando quais permissões solicita;
2 - O PagSeguro armazena as informações e retorna o código identificador;
3 - Seu sistema fará o redirecionamento do cliente junto com o código identificador para o Pagseguro;
4 - Já no Pagseguro, o cliente autoriza aplicação;
*/

/* Dados dos clientes e sugestoes de cadastro
Ao criar uma autorização você também pode encaminhar os dados do cliente. Assim, caso o e-mail do vendedor enviado via API já esteja cadastrado na base, será sugerido o login com este e-mail.
Caso ele não tenha conta, os dados serão utilizados como sugestão para o cadastro e assim facilitando o cadastro do cliente.

Quantos mais dados corretos forem informados, maior a chance de conversão do vendedor não cadastrado nesse fluxo.
É possível encaminhar os dados tanto de um cliente Vendedor (utilizando CPF) quanto para um cliente Empresarial (Utilizando o CNPJ).

TRATANDO RESPOSTA
https://pagseguro.uol.com.br/v2/authorization/request.jhtml?code={resquestCode}

Ao realizar a chamada com sucesso à API de autorização e redirecionar o cliente ao PagSeguro, será exibido uma tela com base nas informações que você encaminhou na chamada.

Se o cliente clique em "Autorizar , ele será redirecionado para a sua URL de retorno. Neste retorno o PagSeguro encaminha via GET o código de notificação da autorização para que você possa consultar o resultado desta autorização.

O retorno será feito como no exemplo a seguir:
GET http://www.seusite.com.br/retorno?notificationCode={notificationCode}

É exatamente com esse notificationCode que, fazendo a consulta do mesmo obterá os dados do vendedor que autorizou aplicação, como por exemplo:

Autorizações que foram solicitadas e autorizadas, e onde será retornada a PUBLICKEY por exemplo.

FAQ
Estou enviando o request para o fluxo de autorização, mas estou tomando erro "Forbidden", o que pode ser?
Isso pode ocorrer por algumas razões:
*A conta que irá autorizar a aplicação não está verificada;
*A conta que irá autorizar a aplicação está inativa;
*Se estiver tentando realizar um split por exemplo, a conta seller não autorizou a aplicação;
*/

/*  DATA TO ACCESS THE LOGIN AFTER REDIRECTING THE USER
SELLER_EMAIL_DEV=v87131781389010066668@sandbox.pagseguro.com.br
SELLER_PASSWORD_DEV=jJ1lm7AgX2fVvgUr
SELLER_PUBLIC_KEY_DEV=PUBB8C9131191A246E1AFD9CEE2B70E049D
 */

// POST
// for now, only works on production. Even the dev code should use in the main pagseguro
// this is called directly in the auth register request for bizTeam members
// only the redirect link with auth code is sent to frontend
exports.getAgentRedirectAuthCode = async (data) => {
    const {
        accountType = "Vendedor", // O tipo documento permitido para o vendedor é somente CPF
        uniqueLinkId,
        agentName,
        agentEmail,
        // agentCPF,
        // agentBirthDate = "1994/08/23",
        // agentAreaCode = "92", // Um número de 2 dígitos correspondente a um DDD válido.
        // agentNumber = "992817363", // Aceita apenas números de 8 a 9 dígitos.
        //phoneType = "MOBILE", // Os tipos de telefone permitidos são HOME, MOBILE e BUSINESS.
        //docType = "CPF", // Aceitará apenas números de CPF válidos e não restritos (no PagSeguro/UOL).
    } = data;

    const params = {
        appId: process.env.SPLIT_APP_ID_PAGSEGURO_PROD,
        appKey: process.env.SPLIT_APP_KEY_PAGSEGURO_PROD,
    };

    // n1 params reference
    const xmlBody = `
        <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <authorizationRequest>
            <reference>${uniqueLinkId}</reference>
            <permissions>
                <code>CREATE_CHECKOUTS</code>
                <code>MANAGE_PAYMENT_PRE_APPROVALS</code>
                <code>DIRECT_PAYMENT</code>
                <code>RECEIVE_TRANSACTION_NOTIFICATIONS</code>
                <code>SEARCH_TRANSACTIONS</code>
            </permissions>
            <account>
                <type>${accountType}</type>
                <email>${agentEmail}</email>
                <person>
                    <name>${agentName}</name>
                </person>
            </account>
            <redirectURL>${CLIENT_URL}/t/app/nucleo-equipe/registro</redirectURL>
            <notificationURL>${agentRegisterNotifyUrl}</notificationURL>
        </authorizationRequest>
    `;

    const config = {
        method: "post",
        url: `https://ws.pagseguro.uol.com.br/v2/authorizations/request`,
        params,
        data: xmlBody,
        headers: {
            "Content-Type": "application/xml; charset=ISO-8859-1",
        },
    };

    const response = await axios(config).catch((e) => {
        res.status(400).json(e.response.data);
    });
    if (!response) return;

    const xml = response.data;
    const result = await convertXmlToJson(xml); // n2 raw example

    const [authCode] = result.authorizationRequest.code;
    return authCode;
};

/* temporary disabled until to apply the methods to treat each format
root element is <account>
<documents>
    <document>
        <type>${docType}</type>
        <value>${agentCPF}</value>
    </document>
</documents>
<birthDate>${agentBirthDate}</birthDate>
<phones>
    <phone>
        <type>${phoneType}</type>
        <areaCode>${agentAreaCode}</areaCode>
        <number>${agentNumber}</number>
    </phone>
</phones>

 */

/* COMMENTS
n1:
<reference> - Identificador usado para fazer referência à autorização da sua requisição.
<permissions> * - Permissões a serem autorizadas
    <code>CREATE_CHECKOUTS</code> - (HIGH PRIORITY) A aplicação poderá direcionar compradores para o PagSeguro e intermediar pagamentos
    <code>MANAGE_PAYMENT_PRE_APPROVALS</code> - (HIGH PRIORITY) A aplicação poderá gerenciar e utilizar pré-aprovações de pagamentos
    <code>DIRECT_PAYMENT</code> - (HIGH PRIORITY) - A aplicação poderá gerenciar pagamentos via checkout transparente.
    <code>RECEIVE_TRANSACTION_NOTIFICATIONS</code> -  A aplicação poderá receber e consultar notificações das transações que ela intermediou
    <code>SEARCH_TRANSACTIONS</code> -  A aplicação poderá consultar as transações que ela intermediou
<redirectURL> * - URL para onde o comprador será redirecionado após a finalização do fluxo de autorização. Caso seja informado na chamada, será utilizada esta ao invés da URL informada no cadastro da aplicação.
<notificationURL> - URL para onde a notificação será direcionada após a finalização do fluxo de autorização.
<account> - Este campo é a raiz do arquivo XML e engloba os dados do cadastro.
    <email> um e-mail válido (p.e., usuario@site.com.br), com no máximo 60 caracteres
    <type> Os tipos de contas são: Vendedor ou Empresarial

n2:
{
    "authorizationRequest": {
        "code": [
            "413678B4E9E24139A03B50CE89562D57"
        ],
        "date": [
            "2021-01-06T19:47:11.000-03:00"
        ]
    }
}

Qual tipo do seu negócio?
 Advogados e Serviços Legais
 Alfaiates/Costureiras
 Ambulante
 Arquiteto e Engenheiro
 Arte e Antiguidades
 Artigos Religiosos
 Automóveis e Acessórios
 Açougues
 Bebês
 Borracheiro/Mecanico/Funilaria/Pintura
 Cabelereiro/Barbeiro/Manicure
 Cama, Mesa e Banho
 Celulares e Telefonia
 Chaveiro
 Comida, Bebida e Nutricional
 Comércio varejista de bebidas
 Comércio varejista de doce/bala/bombom/semelhante
 Corretor de imobiliária
 Corretor de seguro
 Dentistas
 Despachante
 Eletrônicos / Eletrodomésticos
 Empreiteiros Autonomos
 Entidades Públicas
 Esporte
 Esteticista / Massagista
 Feira Livre
 Fisiot/Fonoaud/Nutric/Psicol/Enfermeiros
 Fotógrafo
 Hipermercados/mercados/minimercados
 Hospedagem e Turismo
 Jardineiro/Florista/Paisagista
 Jóias e Relógios
 Marceneiros/Serralheiros/Vidraceiros
 Médicos
 Móveis e Decoração
 Outras atividades profissionais
 Padarias
 Personal Trainer
 Pet Shop
 Podólogos/Pedicuros
 Reparos e Materiais de Construção
 Restaurantes e similares
 Roupas e Acessórios
 Sapateiro
 Serviços de Educação
 Serviços de recreação e lazer
 Serviços profissionais diversos
 Sex shop / Conteúdo Adulto
 Tatuadores
 Telecomunicações
 Táxi - Autonomos
 Venda a Domicilio
 Veterinarios
*/
