// initialize checkouts - página de pagamento
const xml2js = require("xml2js");

const axios = require("axios");
const { globalVar } = require("./globalVar");

const parser = new xml2js.Parser({ attrkey: "ATTR" });
const { payUrl, sandboxMode, email, token } = globalVar;

// TRANSPARENT CHECKOUT - full control of PAGSEGURO's API to run payment in my own app/website
/*
frontend script:
<script type="text/javascript" src=
"https://stc.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js"></script>
Método: PagSeguroDirectPayment

PagSeguroDirectPayment.setSessionId('ID_DA_SESSÃO_OBTIDO_NO_PASSO_1');

onSenderHashReady
O senderHash é um identificador com os dados do comprador baseado naquela determinada sessão, garantindo a segurança da venda.
Obrigatório para todos os meios de pagamento.
O método onSenderHashReady possui algumas dependências , por isso, recomendamos que o mesmo não seja executado no onLoad da página ou mesmo onClick no evento "Finalizar Compra". Você pode executá-lo, por exemplo, no momento em que o cliente seleciona o campo destinado ao "Nome completo do comprador".

getBrand
O método getBrand é utilizado para verificar qual a bandeira do cartão que está sendo digitada. Esse método recebe por parâmetro o BIN (seis primeiros dígitos do cartão) e retorna dados como qual a bandeira, o tamanho do CVV, se possui data de expiração e qual algoritmo de validação.

getInstallments
Você deve utilizar este método caso queira apresentar as opções de parcelamento disponíveis ao comprador. Esse método recebe o valor total a ser parcelado e retorna as opções de parcelamento calculadas de acordo com as configurações de sua conta.
Para obter um resultado mais preciso, você também pode informar a bandeira, de acordo com o nome retornado no método getBrand.

createCardToken
O método createCardToken utiliza os dados do cartão de crédito para gerar um token que será enviado no Passo 3, pois por motivos de segurança os dados do cartão não são enviados diretamente na chamada.

As chamadas para os meios de pagamento do Checkout Transparente deverão ser efetuadas para o endpoint abaixo utilizando o método POST:
POST https://ws.pagseguro.uol.com.br/v2/transactions?{{credenciais}}
N1 more exemples below
 */

// POST - generate a authorization session token
// This will be the choice for my own checkout customization
function createTransparentCode(req, res) {
    const params = {
        email,
        token,
    };

    const config = {
        method: "post",
        url: `${payUrl}/sessions`,
        params,
        headers: {
            "Accept-Charset": "ISO-8859-1",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
}

// POST - Create a transation - Obter autorização - Código Checkout
// default checkout - for lightbox or default modes only
function createDefaultCode(req, res) {
    const {
        reference,
        itemId1,
        itemDescription1,
        itemQuantity1 = 1,
        itemAmount1 = 0.0,
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

module.exports = {
    createTransparentCode,
    createDefaultCode,
};

/*
Exemplo de checkout com BOLETO:
paymentMode=default
&paymentMethod=boleto
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
&senderCPF=72962940005
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

Exemplo de checkout com DÉBITO ONLINE:
paymentMode=default
&paymentMethod=deft
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
