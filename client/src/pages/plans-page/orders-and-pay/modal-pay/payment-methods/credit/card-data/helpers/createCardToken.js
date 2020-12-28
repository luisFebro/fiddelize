export function createCardToken({ cardData, PagSeguro }) {
    // n4

    const run = (resolve, reject) => {
        const { cardNumber, cardBrand, cardCvv, cardVal } = cardData;
        PagSeguro.createCardToken({
            cardNumber: cardNumber, // Número do cartão de crédito
            brand: cardBrand, // Bandeira do cartão
            cvv: cardCvv, // CVV do cartão
            expirationMonth: cardVal, // Mês da expiração do cartão
            expirationYear: `2026`, // Ano da expiração do cartão, é necessário os 4 dígitos.
            success: function (response) {
                // Retorna o cartão tokenizado.
                resolve(response);
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

/* COMMENTS

n4:
O método createCardToken utiliza os dados do cartão de crédito para gerar um token que será enviado no Passo 3, pois por motivos de segurança os dados do cartão não são enviados diretamente na chamada.
*/
