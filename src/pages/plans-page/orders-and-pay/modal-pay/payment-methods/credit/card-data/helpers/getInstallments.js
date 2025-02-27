const MAX_INSTALLMENT_NO_INTEREST = 2;

export { MAX_INSTALLMENT_NO_INTEREST };
export default async function getInstallments({ amount, brand = "visa" }) {
    const PagSeguro = window.PagSeguroDirectPayment;

    const run = (resolve, reject) => {
        PagSeguro.getInstallments({
            amount,
            brand, // n3
            maxInstallmentNoInterest: MAX_INSTALLMENT_NO_INTEREST, // n2
            success(response) {
                // Retorna as opções de parcelamento disponíveis
                const installmentOpts = response.installments[brand];
                const onlyInstallments =
                    installmentOpts && installmentOpts.slice(1); // the first option is in cash and already have it.
                resolve(onlyInstallments);
            },
            error(response) {
                reject(response);
            },
            complete(response) {
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
