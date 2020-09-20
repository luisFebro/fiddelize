const axios = require("axios");
const { globalVar } = require("./globalVar");
const fs = require("fs");
const xml2js = require("xml2js");

const parser = new xml2js.Parser({ attrkey: "ATTR" });
const { payUrl, sandboxMode, email, token } = globalVar;

// checkout = página de pagamento.
// POST - Create a transation - Obter autorização - Código Checkout
function createCode(req, res) {
    // const {
    //     someData,
    // } = req.query;

    // LESSONS:
    // 1. all fractional numbers with leading and trailing zeros possibilities need to be STRING.
    // Watch out with application/x-www-form-urlencoded as 'Content-Type' if your intent is passing query strings as parameters
    const params = {
        email,
        token,
        currency: "BRL",
        // items object
        itemId1: 123, // SKU Livre, com limite de 100 caracteres.
        itemDescription1: "Plano Gold com 5 serviços pro", // up until 100 characters
        itemQuantity1: 50,
        itemAmount1: "60.85", // STRING!! ex: 50.00 Decimal, com duas casas decimais separadas por ponto
        itemWeight: 1000, // Um número inteiro correspondendo ao peso em gramas do item. A soma dos pesos de todos os produtos não pode ultrapassar 30000 gramas (30 kg).
        itemShippingCost1: "20.00", // String Decimal, com duas casas decimais separadas por ponto (p.e., 1234.56), maior que 0.00 e menor ou igual a 9999999.00
        //address obj
        addressRequired: false,
        shippingAddressStreet: "Rua da Indústria, n* 13 B", // Livre, com limite de 80 caracteres.
        shippingAddressNumber: "13 B", //Livre, com limite de 20 caracteres.
        shippingAddressComplement: "perto do mercadinho", // Livre, com limite de 40 caracteres.
        shippingAddressDistrict: "Compensa 1", // Bairro - Livre, com limite de 60 caracteres - Este campo é opcional e você pode enviá-lo caso já tenha capturado os dados do comprador em seu sistema e queira evitar que ele preencha esses dados novamente no PagSeguro.
        shippingAddressState: "AM", // Duas letras, representando a sigla do estado brasileiro correspondente
        shippingAddressCity: "Manaus", // Livre. Deve ser um nome válido de cidade do Brasil, com no mínimo 2 e no máximo 60 caracteres.
        shippingAddressCountry: "BRA", // No momento, apenas o valor BRA é permitido.
        shippingAddressPostalCode: "69030070", // STRING Um número de 8 dígitos
        shippingType: 2, // 1 - Encomenda normal (PAC), 2 - SEDEX, 3 - Tipo de frete não especificado.
        shippingCost: "1000.00", // STRING!!! Informa o valor total de frete do pedido. // Decimal, com duas casas decimais separadas por ponto (p.e., 1234.56), maior que 0.00 e menor ou igual a 9999999.00.
        // sender (buyer) object
        senderName: "Luis Febro", //No mínimo (nome e sobrenome) duas sequências de caracteres, com o limite total de 50 caracteres.
        senderEmail: "mr.febro@gmail.com", // um e-mail válido (p.e., usuario@site.com.br), com no máximo 60 caracteres
        senderAreaCode: 92, // Um número de 2 dígitos correspondente a um DDD válido.
        senderPhone: "992817363", // STRING Um número de 7 a 9 dígitos
        senderCPF: "02324889242", // STRING in order to display leading and trailing zeros!!!
        senderCNPJ: undefined,
        reference: "PR-Q5-4F7Y05T", // Define um código para fazer referência ao pagamento. Este código fica associado à transação criada pelo pagamento e é útil para vincular as transações do PagSeguro às vendas registradas no seu sistema. Livre, com o limite de 200 caracteres
        redirectURL: "https://fiddelize.com.br", //Uma URL válida, com limite de 255 caractere Determina a URL para a qual o comprador será redirecionado após o final do fluxo de pagamento. Este parâmetro permite que seja informado um endereço de específico para cada pagamento realizado.
        // receiver (salesperson) object
        receiverEmail: "mr.febro@gmail.com", // O e-mail informado deve estar vinculado à conta PagSeguro que está realizando a chamada à API.
        enableRecover: false, //Parâmetro utilizado para desabilitar a funcionalidade recuperação de carrinho.
        timeout: 180, // O tempo mínimo da duração do checkout é de 20 minutos e máximo de 100000 minutos.
        // security
        maxUses: 3, // Um número inteiro maior que 0 e menor ou igual a 999. , Determina o número máximo de vezes que o código de pagamento criado pela chamada à API de Pagamentos poderá ser usado. Este parâmetro pode ser usado como um controle de segurança.
        maxAge: 86400, // 86400 = um dia. Um número inteiro maior ou igual a 30 e menor ou igual a 999999999. Prazo de validade do código de pagamento. Determina o prazo (em segundos) durante o qual o código de pagamento criado pela chamada à API de Pagamentos poderá ser usado.
        extraAmount: "-50.00", // StRING!!! Especifica um valor extra que deve ser adicionado ou subtraído ao valor total do pagamento. Otimo se precisar oferecer coupos de desconto para o cliente Decimal (positivo ou negativo), com duas casas decimais separadas por ponto (p.e., 1234.56 ou -1234.56), maior ou igual a -9999999.00 e menor ou igual a 9999999.00. Quando negativo, este valor não pode ser maior ou igual à soma dos valores dos produtos.
    };

    const config = {
        method: "post",
        url: `${payUrl}/checkout`,
        params,
        headers: {
            "Accept-Charset": "ISO-8859-1",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    axios(config)
        .then((response) => {
            const xml = response.data;
            parser.parseString(xml, function (error, result) {
                if (error === null) {
                    const [checkoutCode] = result.checkout.code;
                    res.json(checkoutCode);
                } else {
                    console.log(error);
                }
            });
        })
        .catch((e) => res.json(e.response.data));
}

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
        url: `${payUrl}/transactions/refunds`,
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
        url: `${payUrl}/transactions/cancels`,
        data: body,
        params,
        headers: {
            "Accept-Charset": "ISO-8859-1",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
};

const readTransaction = () => {
    const { transactionCode } = req.query;

    const params = {
        email,
        token,
    };

    const config = {
        method: "post",
        url: `${payUrl}/transactions/${transactionCode}`,
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
        url: `${payUrl}/transactions`,
        data: body,
        params,
        headers: {
            "Accept-Charset": "ISO-8859-1",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
};

module.exports = {
    createCode,
    refundTransaction,
    cancelTransaction,
    readTransaction,
    readHistory,
};
