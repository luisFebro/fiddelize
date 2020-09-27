const User = require("../../models/user/User");
const Order = require("../../models/order/Order");
const axios = require("axios");
const { globalVar } = require("./globalVar");

const { payUrl, sandboxMode, email, token } = globalVar;

// real time notification to Fiddelize's system every time a transation's status change like pending to paid.
/*
Enquanto seu sistema não receber uma notificação, o PagSeguro irá envia-la novamente a cada 2 horas, até um máximo de 5 tentativas
Note que a notificação não possui nenhuma informação sobre a transação.
*/

const getPagNotify = (req, res) => {
    console.log("req", req);
    res.header("Access-Control-Allow-Origin", "*");
    // consulting notification transaction
    const notificationCode = "123312";

    const params = {
        email,
        token,
    };

    const config = {
        method: "get",
        url: `${payUrl}/v3/transactions/notifications/${notificationCode}`,
        params,
        headers: {
            charset: "ISO-8859-1",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    axios(config);
};

const readTransaction = () => {
    const { transactionCode } = req.query;

    const params = {
        email,
        token,
    };

    const config = {
        method: "post",
        url: `${payUrl}/v2/transactions/${transactionCode}`,
        data: body,
        params,
        headers: {
            "Accept-Charset": "ISO-8859-1",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
};

const readHistory = () => {
    const {
        reference,
        initialDate,
        finalDate,
        page = 1,
        maxPageResults = 10,
    } = req.query;

    const params = {
        email,
        token,
        reference, // * Código de referência da transação. Código informado na criação da transação para fazer referência ao pagamento.
        initialDate, // Obrigatório:** Se estiver utilizando o finalDate Especifica a data inicial do intervalo de pesquisa. Somente transações criadas a partir desta data serão retornadas. Esta data não pode ser anterior a 6 meses da data corrente. Formato:YYYY-MM-DDThh:mm:ss.sTZD
        finalDate,
        page, // O número de resultados retornado pela consulta por código de referência pode ser grande, portanto é possível fazer a paginação dos resultados. A primeira página retornada é 1 e assim por diante. Este parâmetro especifica qual é a página de resultados a ser retornada.
        maxPageResults, //Número máximo de resultados por página. Para limitar o tamanho da resposta de cada chamada à consulta, é possível especificar um número máximo de resultados por página.
    };

    const config = {
        method: "post",
        url: `${payUrl}/v2/transactions`,
        data: body,
        params,
        headers: {
            "Accept-Charset": "ISO-8859-1",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
};

// Estornar transação.
const refundTransaction = () => {
    const { transactionCode } = req.body;

    const params = {
        email,
        token,
    };

    const body = {
        transactionCode, // Transação deverá estar com os status Paga, Disponível ou Em disputa.  Formato: Uma sequência de 36 caracteres, com os hífens, ou 32 caracteres, sem os hífens.
        refundValue, // STRING Utilizado no estorno de uma transação, corresponde ao valor a ser devolvido. Se não for informado, o PagSeguro assume que o valor a ser estornado é o valor total da transação
    };

    const config = {
        method: "post",
        url: `${payUrl}/v2/transactions/refunds`,
        data: body,
        params,
        headers: {
            "Accept-Charset": "ISO-8859-1",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
};

const cancelTransaction = () => {
    const { transactionCode } = req.body;

    const params = {
        email,
        token,
    };

    const body = {
        transactionCode, // Transação deverá estar com os status Aguardando pagamento ou Em análise
    };

    const config = {
        method: "post",
        url: `${payUrl}/v2/transactions/cancels`,
        data: body,
        params,
        headers: {
            "Accept-Charset": "ISO-8859-1",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
};

module.exports = {
    readTransaction,
    readHistory,
    refundTransaction,
    cancelTransaction,
    getPagNotify,
};
