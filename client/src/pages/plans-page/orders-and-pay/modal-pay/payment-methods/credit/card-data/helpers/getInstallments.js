const MAX_INSTALLMENT_NO_INTEREST = 2;

export default function getInstallments({ amount, brand, PagSeguro }) {
    const run = (resolve, reject) => {
        PagSeguro.getInstallments({
            amount,
            brand, // n3
            maxInstallmentNoInterest: MAX_INSTALLMENT_NO_INTEREST, // n2
            success: function (response) {
                // Retorna as opções de parcelamento disponíveis
                resolve(response.installments[brand]);
            },
            error: function (response) {
                reject(response);
            },
            complete: function (response) {
                // Callback para todas chamadas.
            },
        });
    };

    return new Promise(run);
}

/*
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
 */
