// TRANSPARENT CHECKOUT - full control of PAGSEGURO's API to run payment in my own app/website
// start and finish checkout flow - página de pagamento
const qs = require("querystring");
const Order = require("../../models/order/Order");
const { getPayCategoryType } = require("./helpers/getTypes");
const axios = require("axios");
const { payUrl, email, token } = require("./globalVar");
const convertXmlToJson = require("../../utils/promise/convertXmlToJson");
// PAY METHODS
const createBoleto = require("./pay-methods/boleto");

function handleAmounts(num1, num2, options = {}) {
    const { op = "+" } = options;

    let sumNums;
    if (op === "+") {
        sumNums = Number(num1) - Number(num2);
    } else {
        sumNums = Number(num1) + Number(num2);
    }

    sumNums = sumNums.toFixed(2).toString();
    return sumNums;
}

// POST - generate a authorization session token
// This will be the choice for my own checkout customization
async function startCheckout(req, res) {
    const params = {
        email,
        token,
    };

    const config = {
        method: "post",
        url: `${payUrl}/v2/sessions`,
        params,
        headers: {
            charset: "ISO-8859-1",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    const response = await axios(config);

    const xml = response.data;
    const result = await convertXmlToJson(xml);

    const [checkoutCode] = result.session.id;
    res.json(checkoutCode);
}

// POST
async function finishCheckout(req, res) {
    const { userId } = req.query;

    let {
        reference = "123",
        paymentMethod = "boleto", // *
        // sender (buyer) object
        senderHash, // * (fingerprint) gerado pelo JavaScript do PagSeguro. Formato: Obtido a partir de uma chamada javascript PagseguroDirectPayment.onSenderHashReady().
        senderName = "captain great", // * No mínimo (nome e sobrenome) duas sequências de caracteres, com o limite total de 50 caracteres.
        senderEmail = "captainGreat@sandbox.pagseguro.com.br", // * um e-mail válido (p.e., usuario@site.com.br), com no máximo 60 caracteres
        senderAreaCode = "92", // * Um número de 2 dígitos correspondente a um DDD válido.
        senderPhone = "992817363", // * STRING Um número de 7 a 9 dígitos
        senderCPF, // * STRING in order to display leading and trailing zeros!!!
        senderCNPJ = undefined, // * if no CPF
        // items
        itemId1 = "123", // * SKU Livre, com limite de 100 caracteres. Você pode escolher códigos que tenham significado para seu sistema e informá-los nestes parâmetros. O PagSeguro não realiza qualquer validação sobre esses identificadores, mas eles não podem se repetir em um mesmo pagamento.
        itemDescription1 = "Cool Service", // * up until 100 characters, Descrevem os itens sendo pagos. A descrição é o texto que o PagSeguro mostra associado a cada item quando o comprador está finalizando o pagamento, portanto é importante que ela seja clara e explicativa.
        itemQuantity1 = 1, // *
        itemAmount1 = "0.00", // * STRING!! ex: 50.00 Decimal, com duas casas decimais separadas por ponto
        extraAmount = "-1.00", // StRING!!!Esse valor pode representar uma taxa extra a ser cobrada no pagamento ou um desconto a ser concedido, caso o valor seja negativo. Especifica um valor extra que deve ser adicionado ou subtraído ao valor total do pagamento. Otimo se precisar oferecer coupos de desconto para o cliente Decimal (positivo ou negativo), com duas casas decimais separadas por ponto (p.e., 1234.56 ou -1234.56), maior ou igual a -9999999.00 e menor ou igual a 9999999.00. Quando negativo, este valor não pode ser maior ou igual à soma dos valores dos produtos.
        // boleto
        firstDueDate = "2020-10-08",
        // credit card
        installmentQuantity, // * Quantidade de parcelas escolhidas pelo cliente. Formato: Um inteiro entre 1 e 18.
        installmentValue, // * Se uma parcela, valor inteiro da compra. Valor das parcelas obtidas no serviço de opções de parcelamento. Formato: Numérico com 2 casas decimais e separado por ponto.
        noInterestInstallmentQuantity, // * Quantidade de parcelas sem juros oferecidas ao cliente. O valor deve ser o mesmo indicado no método getInstallments, no parâmetro maxInstallmentNoInterest.
        creditCardToken, // * token with credit number, expiring date mm/yy, cvv {creditCard_token_obtido_no_passo_2.6}
        creditCardHolderName, // * Nome impresso no cartão de crédito. Formato: min = 1, max = 50 caracteres.
        creditCardHolderCPF, // * 22111944785 Um número de 11 dígitos para CPF ou 14 dígitos para CNPJ (senderCNPJ)
        creditCardHolderBirthDate, // * Data de nascimento do dono do cartão de crédito. Formato: dd/MM/yyyy
        creditCardHolderAreaCode, // * Especifica o código de área (DDD) do comprador que está realizando o pagamento. Formato: Um número de 2 dígitos correspondente a um DDD válido.
        creditCardHolderPhone, // * 56273440
        billingAddressStreet = "Av. Brig. Faria Lima", // Nome da rua do endereço de envio. Informa o nome da rua do endereço de envio do produto. Livre, com limite de 80 caracteres.
        billingAddressDistrict = "Jardim Paulistano", // Bairro do endereço de envio. Informa o bairro do endereço de envio do produto.Formato: Livre, com limite de 60 caracteres.
        billingAddressCity = "Sao Paulo", // Cidade do endereço de envio. Informa a cidade do endereço de envio do produto. Formato: Livre. Deve ser um nome válido de cidade do Brasil, com no mínimo 2 e no máximo 60 caracteres.
        billingAddressState = "SP", // Estado do endereço de envio. Informa o estado do endereço de envio do produto. Formato: Duas letras, representando a sigla do estado brasileiro correspondente.
        billingAddressCountry = "BRA", // País do endereço de envio. Informa o país do endereço de envio do produto. Formato: No momento, apenas o valor BRA é permitido.
        billingAddressPostalCode = "01452002", // CEP do endereço de envio. Informa o CEP do endereço de envio do produto. Formato: Um número de 8 dígitos
        billingAddressNumber = "1384", // Número do endereço de envio. Informa o número do endereço de envio do produto.
        billingAddressComplement = "5o andar", // nforma o complemento (bloco, apartamento, etc.) do endereço de envio do produto. Formato: Livre, com limite de 40 caracteres.
        // address
        shippingAddressRequired = false, // * if no address is sent, then ((Av. Brigadeiro Faria Lima, 1.384 - CEP: 01452002 Sao Paulo-São Paulo)) will be displayed at the bottom of the boleto's doc.
        shippingAddressStreet, // Livre, com limite de 80 caracteres.
        shippingAddressNumber, //Livre, com limite de 20 caracteres.
        shippingAddressComplement, // Livre, com limite de 40 caracteres.
        shippingAddressDistrict, // Bairro - Livre, com limite de 60 caracteres - Este campo é opcional e você pode enviá-lo caso já tenha capturado os dados do comprador em seu sistema e queira evitar que ele preencha esses dados novamente no PagSeguro.
        shippingAddressState, // Duas letras, representando a sigla do estado brasileiro correspondente
        shippingAddressCity, // Livre. Deve ser um nome válido de cidade do Brasil, com no mínimo 2 e no máximo 60 caracteres.
        shippingAddressCountry, // No momento, apenas o valor BRA é permitido.
        shippingAddressPostalCode, // STRING Um número de 8 dígitos
        shippingType, // 1 - Encomenda normal (PAC), 2 - SEDEX, 3 - Tipo de frete não especificado. Informa o tipo de frete a ser usado para o envio do produto. Esta informação é usada pelo PagSeguro para calcular, junto aos Correios, o valor do frete a partir do peso dos itens.
        shippingCost, // STRING!!! Informa o valor total de frete do pedido. Caso este valor seja especificado, o PagSeguro irá assumi-lo como valor do frete e não fará nenhum cálculo referente aos pesos e valores de entrega dos itens. // Decimal, com duas casas decimais separadas por ponto (p.e., 1234.56), maior que 0.00 e menor ou igual a 9999999.00.
        // fiddelize system
        ordersStatement,
        filter,
        renewalReference,
        renewalDaysLeft,
        renewalCurrDays,
        isSingleRenewal,
    } = req.body;
    if (paymentMethod !== "boleto") extraAmount = "0.00";
    const paymentMethods = ["creditCard", "eft", "boleto"];
    if (!paymentMethods.includes(paymentMethod))
        return res
            .status(400)
            .json({
                error: `Invalid payment method. Availables: ${paymentMethods}`,
            });
    const isCreditCard = paymentMethod === "creditCard";

    const params = {
        email,
        token,
    };

    const body = {
        ...req.body,
        // defaults
        currency: "BRL",
        paymentMode: "default",
        notificationURL: "https://fiddelize.herokuapp.com/api/pay/pag-notify",
        receiverEmail: "mr.febro@gmail.com", // Um e-mail válido, com limite de 60 caracteres. O e-mail informado deve estar vinculado à conta PagSeguro que está realizando a chamada à API. LESSON: this fake email (mr.febro2020@gmail.com) to avoid duplicate with boleto on production`s pagseguro does not work> ERROR: invalid receiver: mr.febro2020@gmail.com, verify receiver's account status and if it is a seller's account.
        shippingAddressRequired,
        itemId1,
        itemDescription1,
        itemQuantity1,
        itemAmount1,
        extraAmount,
        billingAddressStreet: isCreditCard ? billingAddressStreet : undefined,
        billingAddressNumber: isCreditCard ? billingAddressNumber : undefined,
        billingAddressComplement: isCreditCard
            ? billingAddressComplement
            : undefined,
        billingAddressDistrict: isCreditCard
            ? billingAddressDistrict
            : undefined,
        billingAddressPostalCode: isCreditCard
            ? billingAddressPostalCode
            : undefined,
        billingAddressCity: isCreditCard ? billingAddressCity : undefined,
        billingAddressState: isCreditCard ? billingAddressState : undefined,
        billingAddressCountry: isCreditCard ? billingAddressCountry : undefined,
    };

    console.log("body", body);

    const config = {
        method: "post",
        url: `${payUrl}/v2/transactions`,
        params,
        data: qs.stringify(body),
        headers: {
            charset: "ISO-8859-1",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    // LESSON: use e.response.data to identify errors. Otherwise, A generic error with only a status will be shown
    const response = await axios(config).catch((e) => {
        res.json(e.response.data);
    });
    if (!response) return;

    const xml = response.data;

    const result = await convertXmlToJson(xml);

    const data = result.transaction;
    const [referenceXml] = data.reference;
    const [feeAmount] = data.feeAmount;
    const [netAmount] = data.netAmount;
    const [grossAmount] = data.grossAmount;
    const [extraAmountXml] = data.extraAmount;

    const payload = {
        userId,
        paymentCategory: getPayCategoryType(paymentMethod),
        reference: referenceXml,
        amount: grossAmount,
        instructions: itemDescription1,
        cpf: senderCPF,
        name: senderName,
        phoneAreaCode: senderAreaCode,
        phoneNumber: senderPhone,
        ordersStatement,
        firstDueDate,
        isRenewal: renewalReference ? true : false,
    };

    const newOrder = new Order({
        reference: referenceXml,
        agentName: "Fiddelize",
        agentId: "5db4301ed39a4e12546277a8",
        clientAdmin: {
            name: senderName,
            id: userId,
        },
        paymentCategory: getPayCategoryType(paymentMethod),
        amount: {
            fee: handleAmounts(feeAmount, extraAmountXml, {
                op: "+",
            }),
            net: netAmount,
            gross: handleAmounts(grossAmount, extraAmountXml, {
                op: "+",
            }),
            extra: extraAmountXml,
        },
        filter,
        isCurrRenewal: renewalReference ? true : undefined,
        totalRenewalDays:
            renewalReference || isSingleRenewal
                ? Number(renewalCurrDays) + Number(renewalDaysLeft)
                : undefined,
        isSingleRenewal: isSingleRenewal ? true : undefined,
    });

    await newOrder.save();

    const renewal = {
        priorRef: renewalReference,
        currRef: referenceXml,
        priorDaysLeft: renewalDaysLeft,
    };
    payload.renewal = renewalReference ? renewal : undefined;

    if (paymentMethod === "boleto") {
        const boletoData = await createBoleto(payload);
        return res.json(boletoData);
    }

    res.json({
        msg: `successful checkout with ${paymentMethod.toUpperCase()} pay method`,
    });
}

module.exports = {
    startCheckout,
    finishCheckout,
};

/*ARCHIVES
function handleData({ Order, payload, res, createNewOrder, renewal, next }) {
    const {
        renewalReference,
        isRenewal,
    } = payload;
        console.log("isRenewal", isRenewal);

    if (isRenewal) {
        return Order.findOneAndUpdate(
            { reference: renewalReference },
            { $set: { isCurrRenewal: true, updatedAt: new Date() } },
            { new: true }
        )
            .select("_id")
            .exec((err, user) => {
                if (err)
                    return res.status(500).json(msgG("error.systemError", err));
                    res.json(user);
                    // payload.renewal = renewal;
                    // req.payload = payload;
                    // next();
            });
        } else {
            createNewOrder(skipCreation);
        }
}

*/

/* ARCHIVES
// POST - Create a transation - Obter autorização - Código Checkout
// default checkout - for lightbox or default modes only
function createDefaultCode(req, res) {
    const {
        reference,
        itemId1,
        itemDescription1,
        itemQuantity1 = 1,
        itemAmount1 = 0.0,
        extraAmount,
        senderCPF,
        senderAreaCode = 92,
        senderPhone,
        senderName,
        senderEmail,
        redirectURL,
    } = req.query;

    // LESSONS:
    // 1. all fractional numbers with leading and trailing zeros possibilities need to be STRING.
    // Watch out with application/x-www-form-urlencoded as 'Content-Type' if your intent is passing query strings as parameters
    const params = {
        email,
        token,
        // items
        itemId1, // * SKU Livre, com limite de 100 caracteres.
        itemDescription1, // * up until 100 characters
        itemQuantity1, // *
        itemAmount1, // * STRING!! ex: 50.00 Decimal, com duas casas decimais separadas por ponto
        extraAmount, // StRING!!! Especifica um valor extra que deve ser adicionado ou subtraído ao valor total do pagamento. Otimo se precisar oferecer coupos de desconto para o cliente Decimal (positivo ou negativo), com duas casas decimais separadas por ponto (p.e., 1234.56 ou -1234.56), maior ou igual a -9999999.00 e menor ou igual a 9999999.00. Quando negativo, este valor não pode ser maior ou igual à soma dos valores dos produtos.
        currency: "BRL",
        itemWeight: undefined, // Um número inteiro correspondendo ao peso em gramas do item. A soma dos pesos de todos os produtos não pode ultrapassar 30000 gramas (30 kg).
        itemShippingCost1: undefined, // String Decimal, com duas casas decimais separadas por ponto (p.e., 1234.56), maior que 0.00 e menor ou igual a 9999999.00
        //address
        addressRequired: false,
        shippingAddressStreet: undefined, // Livre, com limite de 80 caracteres.
        shippingAddressNumber: undefined, //Livre, com limite de 20 caracteres.
        shippingAddressComplement: undefined, // Livre, com limite de 40 caracteres.
        shippingAddressDistrict: undefined, // Bairro - Livre, com limite de 60 caracteres - Este campo é opcional e você pode enviá-lo caso já tenha capturado os dados do comprador em seu sistema e queira evitar que ele preencha esses dados novamente no PagSeguro.
        shippingAddressState: undefined, // Duas letras, representando a sigla do estado brasileiro correspondente
        shippingAddressCity: undefined, // Livre. Deve ser um nome válido de cidade do Brasil, com no mínimo 2 e no máximo 60 caracteres.
        shippingAddressCountry: undefined, // No momento, apenas o valor BRA é permitido.
        shippingAddressPostalCode: undefined, // STRING Um número de 8 dígitos
        shippingType: undefined, // 1 - Encomenda normal (PAC), 2 - SEDEX, 3 - Tipo de frete não especificado.
        shippingCost: undefined, // STRING!!! Informa o valor total de frete do pedido. // Decimal, com duas casas decimais separadas por ponto (p.e., 1234.56), maior que 0.00 e menor ou igual a 9999999.00.
        // sender (buyer) object
        senderName, //No mínimo (nome e sobrenome) duas sequências de caracteres, com o limite total de 50 caracteres.
        senderEmail, // um e-mail válido (p.e., usuario@site.com.br), com no máximo 60 caracteres
        senderAreaCode, // Um número de 2 dígitos correspondente a um DDD válido.
        senderPhone, // STRING Um número de 7 a 9 dígitos
        senderCPF, // STRING in order to display leading and trailing zeros!!!
        senderCNPJ: undefined,
        reference, // SKU Define um código para fazer referência ao pagamento. Este código fica associado à transação criada pelo pagamento e é útil para vincular as transações do PagSeguro às vendas registradas no seu sistema. Livre, com o limite de 200 caracteres
        redirectURL, //Uma URL válida, com limite de 255 caractere Determina a URL para a qual o comprador será redirecionado após o final do fluxo de pagamento. Este parâmetro permite que seja informado um endereço de específico para cada pagamento realizado.
        // payment
        paymentMethodGroup1: "BOLETO", // Para oferecer um parcelamento sem juros, você deverá utilizar três parâmetros: Grupo, Chave e Valor
        paymentMethodConfigKey1_1: "DISCOUNT_PERCENT", // desconto de 5% para o meio de pagamento boleto
        paymentMethodConfigValue1_1: "0.01", // Value must be between 0.01 and 99.99
        paymentMethodGroup2: "CREDIT_CARD", // Para o campo chave, utilize o parâmetro MAX_INSTALLMENTS_NO_INTEREST que configura o parcelamento sem juros. Já no campo valor, você deve informar o número de parcelas que você deseja assumir.
        paymentMethodConfigKey2_1: "MAX_INSTALLMENTS_NO_INTEREST",
        paymentMethodConfigValue2_1: 2,
        excludePaymentMethodGroup: undefined, // e.x: "CREDIT_CARD,BOLETO"
        excludePaymentMethodName: undefined, // e.x DEBITO_ITAU,DEBITO_BRADESCO
        // receiver (salesperson)
        receiverEmail: "mr.febro@gmail.com", // O e-mail informado deve estar vinculado à conta PagSeguro que está realizando a chamada à API.
        enableRecover: false, //Parâmetro utilizado para desabilitar a funcionalidade recuperação de carrinho.
        timeout: undefined, // O tempo mínimo da duração do checkout é de 20 minutos e máximo de 100000 minutos.
        // security
        maxUses: 3, // Um número inteiro maior que 0 e menor ou igual a 999. , Determina o número máximo de vezes que o código de pagamento criado pela chamada à API de Pagamentos poderá ser usado. Este parâmetro pode ser usado como um controle de segurança.
        maxAge: 86400, // 86400 = um dia. Um número inteiro maior ou igual a 30 e menor ou igual a 999999999. Prazo de validade do código de pagamento. Determina o prazo (em segundos) durante o qual o código de pagamento criado pela chamada à API de Pagamentos poderá ser usado.
    };

    const config = {
        method: "post",
        url: `${payUrl}/v2/checkout`,
        params,
        headers: {
            "Accept-Charset": "ISO-8859-1",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    axios(config)
        .then((response) => {
            const xml = response.data;
            const result = await convertXmlToJson(xml);
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
*/
