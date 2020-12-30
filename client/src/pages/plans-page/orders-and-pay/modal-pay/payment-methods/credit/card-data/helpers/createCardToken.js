const getValidationData = (date) => {
    const [month, year] = date.split(" / ");

    return {
        month,
        year: `20${year}`,
    };
};

export { getValidationData };
export default function createCardToken({ cardData }) {
    const PagSeguro = window.PagSeguroDirectPayment;

    const run = (resolve, reject) => {
        // n1
        let { cardNumber, cardBrand, cardCvv, cardVal } = cardData;
        cardNumber = cardNumber && cardNumber.replace(/\s/g, "");

        const { month, year } = getValidationData(cardVal);

        PagSeguro.createCardToken({
            cardNumber: cardNumber, // Número do cartão de crédito
            brand: cardBrand, // Bandeira do cartão
            cvv: cardCvv, // CVV do cartão
            expirationMonth: month, // Mês da expiração do cartão
            expirationYear: year.toString(), // Ano da expiração do cartão, é necessário os 4 dígitos.
            success: function (response) {
                // Retorna o cartão tokenizado.
                resolve(response.card.token);
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

n1:
O método createCardToken utiliza os dados do cartão de crédito para gerar um token que será enviado no Passo 3,
pois por motivos de segurança os DADOS DO CARTÃO NÃO SÃO ENVIADOS DIRETAMENTE NA CHAMADA.
*/
