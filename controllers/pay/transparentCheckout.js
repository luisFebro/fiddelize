// full control of PAGSEGURO's API to run payment in my own app/website
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

const axios = require("axios");
const { globalVar } = require("./globalVar");
const { payUrl, sandboxMode, email, token } = globalVar;

// POST - generate a session
function createSessionCode(req, res) {
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

module.exports = {
    createSessionCode,
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
