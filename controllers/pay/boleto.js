const axios = require("axios");
const { globalVar } = require("./globalVar");

const { email: authEmail } = globalVar;
/*
IMPORTANTE:
Sua aplicação deve estar apta para suportar tempo de resposta de até 1 minuto, pois a dependendo da quantidade de boletos a serem gerados, sua aplicação pode retornar time out enquanto ainda os boletos estiverem sendo gerados no PagSeguro.
Para cada boleto, os clientes precisam pagar R$ 1.00 para cobrir custos de gestão de risco

Por onde gero a segunda via do boleto e gerencio meus boletos?
Através do portal do cliente do PagSeguro.

Quantos boletos são permitidos gerar de uma única vez?
O limite é de 12 boletos.
Valor Mínimo é de 5.00 e máximo 1.000.000

Santander é o banco oficial para a transações via Boleto pelo PagSeguro.
033 - 9 - (9853012970000076264 - 2906010188) - 8 - 3890 - 000015100

A linha digitável do boleto é formada por 47 ou 48 dígitos separados em 5 campos, de acordo com a explicação descrita a seguir.
1. Os três números iniciais indicam o código do banco emissor, de acordo com tabela da Febraban.
2. O quarto número representa o tipo da moeda: 9 para o Real e 0 para outras moedas.
3. Os próximos 29 números são definidos pelo banco emissor. A primeira parte não muda, já a segunda sim (É o número identificador do boleto). Cada instituição pode usá-los como preferir. Geralmente, eles trazem informações sobre a pessoa ou empresa cobradora, número da agência, número identificador do boleto, etc.
4. O 30º número, que fica isolado em um campo, é o dígito verificador. Ele é gerado a partir do cálculo dos números anteriores e tem a função de garantir que os códigos estejam todos corretos.
5. Os quatro números que aparecem depois do dígito verificador representam a data de vencimento. Este número é referente a quantidade de dias passados desde a data-base estipulada pelo Banco Central: 7 de outubro de 1997. Ou seja, o número de dias entre a data-base e a data de vencimento.
6. Os dez ou nove últimos algarismos indicam o valor do documento sem desconto. Ex.: se o boleto tem o valor de R$1000,00, o final será: 0000100000.
https://gerencianet.com.br/blog/campos-dos-boletos-linha-digitavel

Boletos e Código de Barra:
a Federação Brasileira de Bancos (Febraban) realizou um processo de aprimoramento onde só é permito a emissão registrada de boleto, centralizado pelos bancos, tornando mais confiáveis e seguros.
Isso ajuda na a possibilidade de pagar um boleto vencido em qualquer banco ou instituição financeira, diminuição das fraudes e das inconsistências de valores.
 */

function createBoleto(req, res) {
    const payload = {};
    const {
        reference = "123",
        amount = "150.00",
        numberOfPayments = 1,
        instructions = "Plano Ouro com 5 servicos",
        cpf = "02324889242",
        cnpj,
        name = "Ana Maria",
        phoneAreaCode = "92",
        phoneNumber = "992817363",
        email = "luis.felipe.bruno@gmail.com",
        postalCode = "01046010",
        street = "Av. Ipiranga",
        number = "100",
        district = "Republica",
        city = "Sao Paulo",
        state = "SP",
        complement,
    } = payload;

    const params = {
        email: authEmail,
        token: process.env.TOKEN_PAGSEGURO_PROD,
    };

    // DATA BODY
    const addressData = {
        postalCode, // CEP sem traços ou pontos. Formato: Um número de 8 dígitos, p.e. 01046010.
        street, // Nome da rua, Campo alfanumérico livre. Tamanho máximo: 160 caracteres.
        number, // Campo alfanumérico livre. Tamanho máximo: 20 caracteres.
        district, // Bairro. Tamanho máximo: 60 caracteres
        complement, // Campo opcional alfanumérico livre. Tamanho máximo: 40 caracteres
        city, // Campo alfanumérico livre. Deve ser um nome válido de cidade do Brasil. Tamanho máximo: 60 caracteres.
        state, // Duas letras, representando a sigla.
    };
    const customerData = {
        name, // Nome completo ou Razão Social do comprador do produto /serviço referente ao boleto gerado.
        phone: { areaCode: phoneAreaCode, number: phoneNumber },
        email,
        document: { type: cpf ? "CPF" : "CNPJ", value: cpf || cnpj },
        address: addressData, //Dados de endereço do comprador, Os dados de endereço são opcionais, porém a partir do momento que o elemento address é informado, todos os sub-parâmetros dele são obrigatórios.
    };
    const data = {
        reference, // Campo destinado a controles internos do vendedor. Tamanho máximo: 200 caracteres.
        firstDueDate: "2020-09-25", // Formato: aaaa-mm-dd Data de vencimento para qual será gerado o primeiro boleto - permitido 1 dia à partir da data presente até D+30. // Se o parâmetro numberOfPayments > 1, os próximos vencimentos seguirão com a mesma data informada no na data dd nos períodos subsequentes. // Para meses onde não existirem a data informada, será considerado sempre um dia anterior.
        numberOfPayments, // int32 Permitido preencher de 1 a 12.Permitido preencher de 1 a 12. // Informar a quantidade de boletos a serem gerados para cada comprador. n1 exemplo
        amount, // Informar o valor em reais a ser cobrado em cada boleto. Mínimo 5.00 e máximo 1000000.00 decimal, com duas casas decimais separadas por ponto (ex: 1234.56)
        description: instructions, // This does not insert anything in the Boleto Descrição do produto objeto da cobrança.
        periodicity: "monthly", // Atualmente a chamada não aceita nenhum outro valor diferente.
        instructions: `REFERENTE À FIDDELIZE INVISTA - ${instructions}`, // This will appear in the boleto's main instruction button - Campo instruções do boleto, personalizado para uso do vendedor, restrito a 100 caracteres
        customer: customerData,
        notificationURL: "https://fiddelize.com.br/notificações", // URL para recebimento de notificação. Realiza validação de url válida.
    };
    // END DATA BODY

    const config = {
        method: "POST",
        url: `https://ws.pagseguro.uol.com.br/recurring-payment/boletos`, // only works on production
        params,
        data,
        headers: {
            "Content-type": "application/json;charset=ISO-8859-1",
            Accept: "application/json;charset=ISO-8859-1",
        },
    };

    axios(config)
        .then((response) => {
            res.json(response.data);
        })
        .catch((e) => {
            res.json({ error: e.response.data.errors });
        });
}

module.exports = {
    createBoleto,
};

/* COMMENTS
n1:
Exemplo:
firstDueDate: 2017-10-20
numberOfPayments: 4
periodicity: monthly

Boletos gerados:
1. Vencimento em: 20/10/2017
2. Vencimento em: 20/11/2017
3. Vencimento em: 20/12/2017
4. Vencimento em: 20/01/2018
*/
