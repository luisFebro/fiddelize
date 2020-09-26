// TRANSPARENT CHECKOUT - full control of PAGSEGURO's API to run payment in my own app/website
// start and finish checkout flow - página de pagamento
const xml2js = require("xml2js");
const qs = require("querystring");
const Order = require("../../models/order/Order");

const axios = require("axios");
const { globalVar } = require("./globalVar");

const parser = new xml2js.Parser({ attrkey: "ATTR" });
const { payUrl, sandboxMode, email, token } = globalVar;

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
function startCheckout(req, res) {
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

    axios(config)
        .then((response) => {
            const xml = response.data;
            parser.parseString(xml, function (error, result) {
                if (error === null) {
                    const [checkoutCode] = result.session.id;
                    res.json(checkoutCode);
                } else {
                    console.log(error);
                }
            });
        })
        .catch((e) => res.json(e.response.data));
}

const finishCheckout = (req, res, next) => {
    let {
        userId,
        reference = 123,
        paymentMethod = "boleto",
        itemId1 = "123",
        itemDescription1 = "Cool Service",
        itemQuantity1 = 1,
        itemAmount1 = "0.00",
        extraAmount = "-1.00",
        senderCPF,
        senderHash,
        senderAreaCode,
        senderPhone,
        senderName,
        senderEmail = "captainGreat@sandbox.pagseguro.com.br",
        firstDueDate,
        ordersStatement,
    } = req.query;
    if (paymentMethod !== "boleto") extraAmount = "0.00";

    const params = {
        email,
        token,
    };

    const body = {
        reference,
        paymentMethod,
        // sender (buyer) object
        senderHash, // (fingerprint) gerado pelo JavaScript do PagSeguro. Formato: Obtido a partir de uma chamada javascript PagseguroDirectPayment.onSenderHashReady().
        senderName, // * No mínimo (nome e sobrenome) duas sequências de caracteres, com o limite total de 50 caracteres.
        senderEmail, // * um e-mail válido (p.e., usuario@site.com.br), com no máximo 60 caracteres
        senderAreaCode, // * Um número de 2 dígitos correspondente a um DDD válido.
        senderPhone, // * STRING Um número de 7 a 9 dígitos
        senderCPF, // * STRING in order to display leading and trailing zeros!!!
        senderCNPJ: undefined, // * if no CPF
        // items
        itemId1, // * SKU Livre, com limite de 100 caracteres.
        itemDescription1, // * up until 100 characters
        itemQuantity1, // *
        itemAmount1, // * STRING!! ex: 50.00 Decimal, com duas casas decimais separadas por ponto
        extraAmount, // StRING!!! Especifica um valor extra que deve ser adicionado ou subtraído ao valor total do pagamento. Otimo se precisar oferecer coupos de desconto para o cliente Decimal (positivo ou negativo), com duas casas decimais separadas por ponto (p.e., 1234.56 ou -1234.56), maior ou igual a -9999999.00 e menor ou igual a 9999999.00. Quando negativo, este valor não pode ser maior ou igual à soma dos valores dos produtos.
        //address
        shippingAddressRequired: false, // if no address is sent, then ((Av. Brigadeiro Faria Lima, 1.384 - CEP: 01452002 Sao Paulo-São Paulo)) will be displayed at the bottom of the boleto's doc.
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
        // defaults
        currency: "BRL",
        paymentMode: "default",
        notificationURL: "https://fiddelize.com.br/notifica.html",
        receiverEmail: "mr.febro@gmail.com",
    };

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

    axios(config)
        .then((response) => {
            const xml = response.data;
            parser.parseString(xml, function (error, result) {
                if (error === null) {
                    const data = result.transaction;
                    const [transactionCode] = data.code;
                    const [reference] = data.reference;
                    const [feeAmount] = data.feeAmount;
                    const [netAmount] = data.netAmount;
                    const [grossAmount] = data.grossAmount;
                    const [extraAmount] = data.extraAmount;

                    const newOrder = new Order({
                        agentName: "Fiddelize",
                        agentId: "5db4301ed39a4e12546277a8",
                        clientAdmin: {
                            name: senderName,
                            id: userId,
                        },
                        transaction: {
                            // transaction code should be generate in next createBoleto Method.
                            status: 1,
                        },
                        paymentMethod,
                        reference,
                        amount: {
                            fee: handleAmounts(feeAmount, extraAmount, {
                                op: "+",
                            }),
                            net: netAmount,
                            gross: handleAmounts(grossAmount, extraAmount, {
                                op: "+",
                            }),
                            extra: extraAmount,
                        },
                    });

                    newOrder.save().then((order) => {
                        const payload = {
                            userId,
                            transactionCode,
                            reference,
                            amount: grossAmount,
                            instructions: itemDescription1,
                            cpf: senderCPF,
                            name: senderName,
                            phoneAreaCode: senderAreaCode,
                            phoneNumber: senderPhone,
                            email: senderEmail,
                            firstDueDate,
                            ordersStatement,
                        };

                        req.payload = payload;
                        next();
                    });
                } else {
                    console.log(error);
                }
            });
        })
        .catch((e) => res.json(e.response.data));
};

module.exports = {
    startCheckout,
    finishCheckout,
};

/*
Handling responses - BOLETO:
<transaction>
    <date>2011-02-05T15:46:12.000-02:00</date>
    <lastEventDate>2011-02-15T17:39:14.000-03:00</lastEventDate>
    <code>9E884542-81B3-4419-9A75-BCC6FB495EF1</code>
    <reference>REF1234</reference>
    <type>1</type>
    <status>3</status>
    <paymentMethod>
        <type>1</type>
        <code>101</code>
    </paymentMethod>
<paymentLink>
https://pagseguro.uol.com.br/checkout/imprimeBoleto.jhtml?code=314601B208B24A5CA53260000F7BB0D
</paymentLink>
    <grossAmount>49900.00</grossAmount>
    <discountAmount>0.00</discountAmount>
    <feeAmount>0.00</feeAmount>
    <netAmount>49900.50</netAmount>
    <extraAmount>0.00</extraAmount>
    <installmentCount>1</installmentCount>
    <itemCount>2</itemCount>
    <items>
        <item>
            <id>0001</id>
            <description>Notebook Prata</description>
            <quantity>1</quantity>
            <amount>24300.00</amount>
        </item>
        <item>
            <id>0002</id>
            <description>Notebook Rosa</description>
            <quantity>1</quantity>
            <amount>25600.00</amount>
        </item>
    </items>
    <sender>
        <name>José Comprador</name>
        <email>comprador@uol.com.br</email>
        <phone>
            <areaCode>11</areaCode>
            <number>56273440</number>
        </phone>
    </sender>
    <shipping>
        <address>
            <street>Av. Brig. Faria Lima</street>
            <number>1384</number>
            <complement>5o andar</complement>
            <district>Jardim Paulistano</district>
            <postalCode>01452002</postalCode>
            <city>Sao Paulo</city>
            <state>SP</state>
            <country>BRA</country>
        </address>
        <type>1</type>
        <cost>21.50</cost>
    </shipping>
</transaction>
paymentLink . Esse parâmetro pode ser um link de acesso para a imagem do boleto ou para a página de pagamento do banco selecionado. Lembrando que a página do banco não deve ser aberta em um IFrame.

Exemplo de checkout com DÉBITO ONLINE:
paymentMode=default
&paymentMethod=eft
&bankName=itau
&receiverEmail=suporte@lojamodelo.com.br
&currency=BRL
&extraAmount=1.00
&itemId1=0001
&itemDescription1=Notebook Prata
&itemAmount1=24300.00
&itemQuantity1=1
&notificationURL=https://sualoja.com.br/notifica.html
&reference=REF1234
&senderName=Jose Comprador
&senderCPF=22111944785
&senderAreaCode=11
&senderPhone=56273440
&senderEmail=comprador@uol.com.br
&senderHash={hash_obtido_no_passo_2.3}
&shippingAddressRequired=true
&shippingAddressStreet=Av. Brig. Faria Lima
&shippingAddressNumber=1384
&shippingAddressComplement=5o andar
&shippingAddressDistrict=Jardim Paulistano
&shippingAddressPostalCode=01452002
&shippingAddressCity=Sao Paulo
&shippingAddressState=SP
&shippingAddressCountry=BRA
&shippingType=1
&shippingCost=1.00

Exemplo de checkout com CARTÃO DE CRÉDITO:
paymentMode=default
&paymentMethod=creditCard
&receiverEmail=suporte@lojamodelo.com.br
&currency=BRL
&extraAmount=1.00
&itemId1=0001
&itemDescription1=Notebook Prata
&itemAmount1=24300.00
&itemQuantity1=1
&notificationURL=https://sualoja.com.br/notifica.html
&reference=REF1234
&senderName=Jose Comprador
&senderCPF=22111944785
&senderAreaCode=11
&senderPhone=56273440
&senderEmail=comprador@uol.com.br
&senderHash={hash_obtido_no_passo_2.3}
&shippingAddressRequired=true
&shippingAddressStreet=Av. Brig. Faria Lima
&shippingAddressNumber=1384
&shippingAddressComplement=5o andar
&shippingAddressDistrict=Jardim Paulistano
&shippingAddressPostalCode=01452002
&shippingAddressCity=Sao Paulo
&shippingAddressState=SP
&shippingAddressCountry=BRA
&shippingType=1
&shippingCost=1.00
&creditCardToken={creditCard_token_obtido_no_passo_2.6}
&installmentQuantity={quantidade_de_parcelas_escolhida}
&installmentValue={installmentAmount_obtido_no_retorno_do_passo_2.5}
&noInterestInstallmentQuantity={valor_maxInstallmentNoInterest_incluido_no_passo_2.5}
&creditCardHolderName=Jose Comprador
&creditCardHolderCPF=22111944785
&creditCardHolderBirthDate=27/10/1987
&creditCardHolderAreaCode=11
&creditCardHolderPhone=56273440
&billingAddressStreet=Av. Brig. Faria Lima
&billingAddressNumber=1384
&billingAddressComplement=5o andar
&billingAddressDistrict=Jardim Paulistano
&billingAddressPostalCode=01452002
&billingAddressCity=Sao Paulo
&billingAddressState=SP
&billingAddressCountry=BRA
*/

/*
Exemplo de checkout padrão:
const params = {
email,
token,
// items
itemId1, // * SKU Livre, com limite de 100 caracteres.
itemDescription1, // * up until 100 characters
itemQuantity1, // *
itemAmount1, // * STRING!! ex: 50.00 Decimal, com duas casas decimais separadas por ponto
currency: "BRL",
itemWeight: undefined, // Um número inteiro correspondendo ao peso em gramas do item. A soma dos pesos de todos os produtos não pode ultrapassar 30000 gramas (30 kg).
itemShippingCost1: undefined, // String Decimal, com duas casas decimais separadas por ponto (p.e., 1234.56), maior que 0.00 e menor ou igual a 9999999.00
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
shippingCost: undefined, // STRING!!! Informa o valor total de frete do pedido. // Decimal, com duas casas decimais separadas por ponto (p.e., 1234.56), maior que 0.00 e menor ou igual a 9999999.00.
// sender (buyer) object
senderName: "Luis Febro", //No mínimo (nome e sobrenome) duas sequências de caracteres, com o limite total de 50 caracteres.
senderEmail: "mr.febro@gmail.com", // um e-mail válido (p.e., usuario@site.com.br), com no máximo 60 caracteres
senderAreaCode: 92, // Um número de 2 dígitos correspondente a um DDD válido.
senderPhone: "992817363", // STRING Um número de 7 a 9 dígitos
senderCPF: "02324889242", // STRING in order to display leading and trailing zeros!!!
senderCNPJ: undefined,
reference, // SKU Define um código para fazer referência ao pagamento. Este código fica associado à transação criada pelo pagamento e é útil para vincular as transações do PagSeguro às vendas registradas no seu sistema. Livre, com o limite de 200 caracteres
redirectURL: "https://fiddelize.com.br", //Uma URL válida, com limite de 255 caractere Determina a URL para a qual o comprador será redirecionado após o final do fluxo de pagamento. Este parâmetro permite que seja informado um endereço de específico para cada pagamento realizado.
// receiver (salesperson) object
receiverEmail: "mr.febro@gmail.com", // O e-mail informado deve estar vinculado à conta PagSeguro que está realizando a chamada à API.
enableRecover: false, //Parâmetro utilizado para desabilitar a funcionalidade recuperação de carrinho.
timeout: 180, // O tempo mínimo da duração do checkout é de 20 minutos e máximo de 100000 minutos.
// security
maxUses: 3, // Um número inteiro maior que 0 e menor ou igual a 999. , Determina o número máximo de vezes que o código de pagamento criado pela chamada à API de Pagamentos poderá ser usado. Este parâmetro pode ser usado como um controle de segurança.
maxAge: 86400, // 86400 = um dia. Um número inteiro maior ou igual a 30 e menor ou igual a 999999999. Prazo de validade do código de pagamento. Determina o prazo (em segundos) durante o qual o código de pagamento criado pela chamada à API de Pagamentos poderá ser usado.
extraAmount: "-2.00", // StRING!!! Especifica um valor extra que deve ser adicionado ou subtraído ao valor total do pagamento. Otimo se precisar oferecer coupos de desconto para o cliente Decimal (positivo ou negativo), com duas casas decimais separadas por ponto (p.e., 1234.56 ou -1234.56), maior ou igual a -9999999.00 e menor ou igual a 9999999.00. Quando negativo, este valor não pode ser maior ou igual à soma dos valores dos produtos.
};
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
*/
