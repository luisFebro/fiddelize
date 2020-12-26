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
