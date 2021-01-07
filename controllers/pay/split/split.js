const axios = require("axios");
const { payUrl, appKey, appId } = require("../globalVar");
const convertXmlToJson = require("../../../utils/promise/convertXmlToJson");
// payment split to automate the sales process among stakeholders

/*
Em um split de pagamento, sempre existirá o vendedor PRIMÁRIO e vendedor(es) SECUNDÁRIOS(S)

O split de pagamento possibilita a divisão do valor de um determinado checkout entre diversos vendedores, podendo "splitar" tanto o valor líquido da transação quanto taxa, tarifa e taxa de parcelamento.

Sandbox
No caso do modelo de aplicações e split de pagamento, não é necessário criar aplicações, como o sandbox é um ambiente de testes, a aplicação já está criada automaticamente com appKey e appId e com vendedores de testes e suas respectivas publicKeys.

Production
Em produção, é necessário a criação de uma aplicação.
Em produção é necessário consultar o notificationCode que é enviado assim que o seller autoriza sua aplicação, o notificationCode é enviado para a URL que definiu para receber as notificações que o PagSeguro envia.

notificationCode
Consulte o notificationCode enviado para a URL de notificação que cadastrou em sua conta ou enviou no XML do POST de solicitação de autorização.
Fazendo isso, o retorno será as permissões autorizadas do seller inclusive demais dados como a publicKey do mesmo, que é o "identificador" do seller, o que permite a realização do split.

https://dev.pagseguro.uol.com.br/reference/split

É possível estornar o valor de apenas um vendedor, sem alterar o dos outros?
É possível sim, através do estorno parcial e apontar o valor que será do estorno. Porém como premissa é necessário informar todos os valores que vão ficar para cada seller e zerar o valor no qual será estornado ou apontar a diferença.

É possível fazer split sem publicKey (por e-mail)?
Sim, é possível utilizar apenas o e-mail.

QuanTOS estornos consigo realizar?
É possível realizar apenas um estorno parcial ou um estorno total.

Como funciona a divisão de valores, de qual conta as taxas serão cobradas e o recebimento são referenciados?
Todos esses pontos são referentes a conta do primário, sendo importado esse modelo para os demais sellers (Secundário).
*/

// POST - generate session
exports.startSplit = async (req, res) => {
    const params = {
        appId,
        appKey,
    };

    const config = {
        method: "post",
        url: `${payUrl}/sessions`,
        params,
        headers: {
            Accept: "application/vnd.pagseguro.com.br.v3+xml", //  Deve ser aplicado o cabeçalho Accept: application / vnd.pagseguro.com.br.v3 + xml para especificar a versão 3 da API.
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    const response = await axios(config).catch((e) => {
        res.json({ error: "something wrong while starting pay split" });
    });
    if (!response) return;

    const xml = response.data;

    const result = await convertXmlToJson(xml);
    const [splitCode] = result.session.id;

    res.json(splitCode);
};

// GET
exports.getPayMethods = async (req, res) => {
    const {
        sessionId,
        amount = "10.00", // pattern must fit the patern: \\d+.\\d{2}
    } = req.query;

    const params = {
        sessionId,
        amount,
    };

    const config = {
        method: "get",
        url: `${payUrl}/payment-methods/`,
        params,
        headers: {
            Accept:
                "application/vnd.pagseguro.com.br.v1+json;charset=ISO-8859-1", // if XML, then "application/vnd.pagseguro.com.br.v1+xml;charset=ISO-8859-1"
        },
    };

    const response = await axios(config).catch((e) => {
        res.json({ error: e.response.data });
    }); // "something wrong while getting pay methods " +
    if (!response) return;
    console.log("response", response);

    const { data } = response;

    res.json(data);
};

// not working
exports.getCreditCardFlag = async (req, res) => {
    const { sessionId, creditCard } = req.query;

    const params = {
        tk: sessionId,
        creditCard,
    };

    const config = {
        method: "get",
        url: `https://df.uol.com.br/df-fe/mvc/creditcard/v1/getBin`,
        params,
    };

    const response = await axios(config).catch((e) => {
        res.json({ error: e });
    });
    if (!response) return;

    const { data } = response;
    res.json(data);
};

/* NOT INSERTED AS ROUTE YET */
// POST
exports.getCardToken = async (req, res) => {
    const { email, token } = req.query; // token from where is unknown for now

    const params = {
        email,
        token,
    };

    const {
        sessionId = "",
        amount = "",
        cardNumber = "",
        cardBrand = "", // Bandeira do cartão
        cardCvv = "", // Código de segurança
        cardExpirationMonth = "00", // Mês de expiração 2 dígitos
        cardExpirationYear = "0000",
    } = req.body;

    const body = {
        ...req.body,
    };

    const config = {
        method: "post",
        url: `https://df.uol.com.br/v2/cards/`,
        params,
        data: body,
    };
};

// get
exports.getInstallmentOptions = async (req, res) => {
    const {
        sessionId = "",
        amount = "",
        creditCardBrand = "",
        maxInstallmentNoInterest = "",
    } = req.query;

    const params = {
        ...req.query,
    };

    const config = {
        method: "get",
        url: `https://pagseguro.uol.com.br/checkout/v2/installments.json`,
        params,
    };

    const response = await axios(config).catch((e) => {
        res.json({ error: e });
    });
    if (!response) return;

    const { data } = response;
    res.json(data);
};

exports.setCreditCardSplit = async (req, res) => {
    const {
        appId = "", // *
        appKey = "", // *
    } = req.query;

    const params = {
        ...req.query,
    };

    const config = {
        method: "post",
        url: `${payUrl}/transactions`,
        params,
    };

    const response = await axios(config).catch((e) => {
        res.json({ error: e });
    });
    if (!response) return;

    const { data } = response;
    res.json(data);
};

// post - Não é possível no momento testar o estorno total e parcial em sandbox, somente em produção.
exports.getSplitRefund = async (req, res) => {
    const {
        transactionId = "", // *
        appId = "", // *
        appKey = "", // *
    } = req.query;

    const params = {
        appId,
        appKey,
    };

    const config = {
        method: "post",
        url: `https://ws.pagseguro.uol.com.br/transactions/${transactionId}/totalRefund/splitpayment`,
        params,
    };

    const response = await axios(config).catch((e) => {
        res.json({ error: e });
    });
    if (!response) return;

    const { data } = response;
    res.json(data);
};

/*
&payment.mode=default
&payment.method=creditCard
&currency=BRL
&item[1].id=001
&item[1].description=Product 1 Description
&item[1].amount=100.00
&item[1].quantity=1
&notificationURL=https://yourstore.com.br/notification
&reference=ORDER123
&sender.name=Customer Name
&sender.CPF=22111944785
&sender.areaCode=11
&sender.phone=56273440
&sender.email=customer@uol.com.br
&sender.hash=c162e6131dbb9696e8b49147a9c5eacabac0cdca91458ee5177819d0a3c9d565
&shipping.address.street=Av. Brig. Faria Lima
&shipping.address.number=1384
&shipping.address.complement=5o andar
&shipping.address.district=Jardim Paulistano
&shipping.address.postalCode=01452002
&shipping.address.city=Sao Paulo
&shipping.address.state=SP
&shipping.address.country=BRA
&shipping.type=3
&shipping.cost=0.00
&installment.quantity=2
&installment.value=50.00
&installment.noInterestInstallmentQuantity=2
&creditCard.token=4as56d4a56d456as456dsa
&creditCard.holder.name=Customer Name
&creditCard.holder.CPF=22111944785
&creditCard.holder.birthDate=27/10/1987
&creditCard.holder.areaCode=11
&creditCard.holder.phone=56273440
&billingAddress.street=Av. Brig. Faria Lima
&billingAddress.number=1384
&billingAddress.complement=5o andar
&billingAddress.district=Jardim Paulistano
&billingAddress.postalCode=01452002
&billingAddress.city=Sao Paulo
&billingAddress.state=SP
&billingAddress.country=BRA
&primaryReceiver.publicKey=PUBCF30546BDF334CC3A59D772E3636D8D3
&receiver[1].publicKey=PUBCF30546BDF334CC3A59D772E3636D8D5
&receiver[1].split.amount=30.00"
 */

/* Split examples
Esplitando R$ 50 com uma transação por boleto.

&payment.mode=default
&payment.method=boleto
&currency=BRL
&item[1].id=0001
&item[1].description=Product 1 Description
&item[1].amount=100.00
&item[1].quantity=1
&notificationURL=https://yourstore.com.br/notification
&reference=ORDER123
&sender.name=Customer Name
&sender.CPF=22111944785
&sender.areaCode=11
&sender.phone=56273440
&sender.email=customer@uol.com.br
&sender.hash=c162e6131dbb9696e8b49147a9c5eacabac0cdca91458ee5177819d0a3c9d565
&shipping.address.street=Av. Brig. Faria Lima
&shipping.address.number=1384
&shipping.address.complement=5o andar
&shipping.address.district=Jardim Paulistano
&shipping.address.postalCode=01452002
&shipping.address.city=Sao Paulo
&shipping.address.state=SP
&shipping.address.country=BRA
&shipping.type=3
&shipping.cost=0.00
// SPLIT PART HERE
&primaryReceiver.publicKey:PUBCF30546BDF334CC3A59D772E3636D8D3
&receiver[1].publicKey:PUBCF30546BDF334CC3A59D772E3636D8D4
&receiver[1].split.amount=20.00
&receiver[2].publicKey=PUBCF30546BDF334CC3A59D772E3636D8D5
&receiver[2].split.amount=30.00"
// SPLIT PART HERE


Esplitando com débito online

&payment.mode=default
&payment.method=eft
&bank.name=itau
&currency=BRL
&item[1].description=Product 1 Description
&item[1].amount=100.00
&item[1].quantity=1
&notificationURL=https://yourstore.com.br/notification
&reference=ORDER123
&sender.name=Customer Name
&sender.CPF=22111944785
&sender.areaCode=11
&sender.phone=56273440
&sender.email=customer@uol.com.br
&sender.hash=c162e6131dbb9696e8b49147a9c5eacabac0cdca91458ee5177819d0a3c9d565
&shipping.address.street=Av. Brig. Faria Lima
&shipping.address.number=1384
&shipping.address.complement=5o andar
&shipping.address.district=Jardim Paulistano
&shipping.address.postalCode=01452002
&shipping.address.city=Sao Paulo
&shipping.address.state=SP
&shipping.address.country=BRA
&shipping.type=3
&shipping.cost=0.00
// SPLIT
&primaryReceiver.publicKey=PUBCF30546BDF334CC3A59D772E3636D8D3
&receiver[1].publicKey=PUBCF30546BDF334CC3A59D772E3636D8D4
&receiver[1].split.amount=20.00
&receiver[2].publicKey=PUBCF30546BDF334CC3A59D772E3636D8D5
&receiver[2].split.amount=30.00"
// SPLIT

Esplitando com CARTÃO DE CRÉDITO
&payment.mode=default
&payment.method=creditCard
&currency=BRL
&item[1].description=Product 1 Description
&item[1].amount=100.00
&item[1].quantity=1
&notificationURL=https://yourstore.com.br/notification
&reference=ORDER123
&sender.name=Customer Name
&sender.CPF=22111944785
&sender.areaCode=11
&sender.phone=56273440
&sender.email=customer@uol.com.br
&sender.hash=c162e6131dbb9696e8b49147a9c5eacabac0cdca91458ee5177819d0a3c9d565
&shipping.address.street=Av. Brig. Faria Lima
&shipping.address.number=1384
&shipping.address.complement=5o andar
&shipping.address.district=Jardim Paulistano
&shipping.address.postalCode=01452002
&shipping.address.city=Sao Paulo
&shipping.address.state=SP
&shipping.address.country=BRA
&shipping.type=3
&shipping.cost=0.00
&installment.quantity=2
&installment.value=50.00
&installment.noInterestInstallmentQuantity=2
&creditCard.token=4as56d4a56d456as456dsa
&creditCard.holder.name=Customer Name
&creditCard.holder.CPF=22111944785
&creditCard.holder.birthDate=27/10/1987
&creditCard.holder.areaCode=11
&creditCard.holder.phone=56273440
&billingAddress.street=Av. Brig. Faria Lima
&billingAddress.number=1384
&billingAddress.complement=5o andar
&billingAddress.district=Jardim Paulistano
&billingAddress.postalCode=01452002
&billingAddress.city=Sao Paulo
&billingAddress.state=SP
&billingAddress.country=BRA
// SPLIT
&primaryReceiver.publicKey=PUBCF30546BDF334CC3A59D772E3636D8D3
&receiver[1].publicKey=PUBCF30546BDF334CC3A59D772E3636D8D5
&receiver[1].split.amount=30.00"


ESTORNO PARCIAL
É necessário fazer a chamada com o endpoint abaixo e o body informando o valor da comissão e o valor repassado ao seller
https://ws.pagseguro.uol.com.br/transactions/ID_TRANSAÇÃO/parcialRefund/splitpayment?appId=INFORME_SEU_APP_ID_AQUI&appKey=INFORME_SUA_APPKEY_AQUI
{
   "primaryReceiver": {
      "split": {
         "amount": "20.37"
      }
   },
   "receivers": [
      {
         "email": "c17292208609802379421@pagseguro.com.br",
         "split": {
            "amount": "50.00"
         }
      }
   ]
}

ESTORNO TOTAL
Neste caso apenas uma chamada ao endpoint abaixo, com o id de transação e appId e AppKey
No estorno total não é retornado nenhum body, apenas OK de sucesso do estorno.
*/
