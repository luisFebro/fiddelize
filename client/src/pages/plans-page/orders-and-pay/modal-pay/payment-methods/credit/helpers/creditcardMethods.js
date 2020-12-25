export async function getBrand(cardNumber, { PagSeguro }) {
    // n1
    const run = (resolve, reject) => {
        PagSeguro.getBrand({
            // PagSeguro is typeof Object, getBrand is a regular function, not a promise.
            cardBin: cardNumber,
            success: function (response) {
                //bandeira encontrada
                resolve(response.brand);
            },
            error: async function (response) {
                //tratamento do erro
                reject(response);
            },
            complete: function (response) {
                //tratamento comum para todas chamadas
            },
        });
    };

    return new Promise(run);
}

export function getInstallments(PagSeguro) {
    PagSeguro.getInstallments({
        amount: 118.8,
        maxInstallmentNoInterest: 2, // n2
        brand: "visa", // n3
        success: function (response) {
            // Retorna as opções de parcelamento disponíveis
        },
        error: function (response) {
            // callback para chamadas que falharam.
        },
        complete: function (response) {
            // Callback para todas chamadas.
        },
    });
}

export function createCardToken(PagSeguro) {
    // n4
    PagSeguro.createCardToken({
        cardNumber: "4111111111111111", // Número do cartão de crédito
        brand: "visa", // Bandeira do cartão
        cvv: "013", // CVV do cartão
        expirationMonth: "12", // Mês da expiração do cartão
        expirationYear: "2026", // Ano da expiração do cartão, é necessário os 4 dígitos.
        success: function (response) {
            // Retorna o cartão tokenizado.
        },
        error: function (response) {
            // Callback para chamadas que falharam.
        },
        complete: function (response) {
            // Callback para todas chamadas.
        },
    });
}

/* COMMENTS
n1:
| Bandeira   | Comeca com                                  | Máximo de número | Máximo de número cvc |
| ---------- | ------------------------------------------- | ---------------- | -------------------- |
| Visa       | 4                                           | 13,16            | 3                    |
| Mastercard | 5                                           | 16               | 3                    |
| Diners     | 301,305,36,38                               | 14,16            | 3                    |
| Elo        | 636368,438935,504175,451416,509048,509067,  |                  | 3(?)
|            | 509049,509069,509050,509074,509068,509040,
|            | 509045,509051,509046,509066,509047,509042,
|            | 509052,509043,509064,509040                 |                  |
|            | 36297, 5067,4576,4011                       | 16               | 3
| Amex       | 34,37                                       | 15               | 4                    |
| Discover   | 6011,622,64,65                              | 16               | 4                    |
| Aura       | 50                                          | 16               | 3                    |
| jcb        | 35                                          | 16               | 3                    |
| Hipercard  | 38,60                                       |
O método getBrand é utilizado para verificar qual a bandeira do cartão que está sendo digitada. Esse método recebe por parâmetro o BIN (seis primeiros dígitos do cartão) e retorna dados como qual a bandeira, o tamanho do CVV, se possui data de expiração e qual algoritmo de validação.
{
        "brand":{
        "name":"visa",
        "bin":411111,
        "cvvSize":3,
        "expirable":true,
        "validationAlgorithm":"LUHN"
    }
}

n2:
Esse parâmetro deverá receber valor maior ou igual a 2.
Lembrando que se este parâmetro for utilizado, o mesmo valor informado deve ser enviado no parâmetro noInterestInstallmentQuantity ao efetuar o checkout

n3:
Para obter um resultado mais preciso, você também pode informar a bandeira, de acordo com o nome retornado no método getBrand.
response exemple:
installments":{
      "visa":[
         {
            "quantity":1,
            "totalAmount":100,
            "installmentAmount":100,
            "interestFree":true
         },
         {
            "quantity":2,
            "totalAmount":100,
            "installmentAmount":50,
            "interestFree":true
         },
         {
            "quantity":3,
            "totalAmount":102.99,
            "installmentAmount":34.33,
            "interestFree":false
         }
      ]
   }

n4:
O método createCardToken utiliza os dados do cartão de crédito para gerar um token que será enviado no Passo 3, pois por motivos de segurança os dados do cartão não são enviados diretamente na chamada.
*/
