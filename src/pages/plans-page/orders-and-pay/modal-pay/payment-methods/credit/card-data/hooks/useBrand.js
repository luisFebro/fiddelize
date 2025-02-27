import { useEffect, useState } from "react";

function getBrand(cardNumber, { PagSeguro }) {
    // n1
    const run = (resolve, reject) => {
        PagSeguro.getBrand({
            // PagSeguro is typeof Object, getBrand is a regular function, not a promise.
            cardBin: cardNumber, // n1
            success(response) {
                // bandeira encontrada
                resolve(response.brand);
            },
            error(response) {
                // tratamento do erro
                reject(response);
            },
            complete(response) {
                // tratamento comum para todas chamadas
            },
        });
    };

    return new Promise(run);
}

export default function useBrand(cardNumber, { setData }) {
    const PagSeguro = window.PagSeguroDirectPayment;

    const [firstSixChar, setFirstSixChar] = useState("");

    const cleanData = () => {
        setData((prev) => ({
            ...prev,
            cardBrand: "",
            cvvSize: "",
            maxCardNumberLength: "",
        }));
    };

    useEffect(() => {
        if (cardNumber && cardNumber.length >= 6) {
            setFirstSixChar(cardNumber.slice(0, 6));
        } else {
            cleanData();
        }
    }, [cardNumber]);

    useEffect(() => {
        if (!firstSixChar) return;

        const go = async () => {
            // LESSON: do not forget to console the error when creating an pure promise. If not working, probably it is some error not being catched.
            const cardData = await getBrand(firstSixChar, { PagSeguro }).catch(
                (e) => {
                    // cleanData();
                    console.log(e);
                }
            );

            if (!cardData) return;

            const {
                name,
                cvvSize,
                config: { acceptedLengths },
            } = cardData;
            const maxCardNumberLength = Math.max(...acceptedLengths);
            setData((prev) => ({
                ...prev,
                cardBrand: name,
                cvvSize,
                maxCardNumberLength,
            }));
        };

        go();
    }, [firstSixChar]);
}

/* Notes
n1
Visa começa com 4;
Mastercard começa com 5[1-5];
Amex (American Express) começa com 34 e 37;

Credit cards also have another three-digit number that usually appears on the back of the card in the signature panel. These numbers can be called CVC numbers (Card Verification Code), but they also go by other names. Their purpose is to provide another level of verification when you make a purchase where the card isn't present, such as a telephone or online transaction.
American Express cards also have a four-digit number on the front that serves the same purpose, called a CVV (Card Verification Value).
https://www.experian.com/blogs/ask-experian/how-many-numbers-are-on-a-credit-card/#:~:text=Credit%20cards%20that%20are%20part,be%20used%20to%20authenticate%20transactions.

| Bandeira   | Comeca com                                  | Máximo de número | Máximo de número cvc |
| ---------- | ------------------------------------------- | ---------------- | -------------------- |
| Visa       | OK 4  (requires at least 2 digits to display brand)| 13,16        | 3                    |
| Mastercard | OK 5  (requires at least 2 digits to display brand)| 16           | 3                    |
| Diners     | OK 301,305,36,38                               | 14,16            | 3                    |
| Elo (national) | OK 636368,438935,504175,451416,509048,509067,  |                  | 3(?)
|            | 509049,509069,509050,509074,509068,509040,
|            | 509045,509051,509046,509066,509047,509042,
|            | 509052,509043,509064,509040                 |                  |
|            | 36297, 5067,4576,4011                       | 16               | 3
| Amex (American Express) | OK 34,37                          | 15               | 4                    |
| Discover   | 6011,622,64,65                              | 16               | 4                    |
| Aura (national)       | 50                          | 16               | 3                    |
| jcb (national)        | NO 35                          | 16               | 3                    |
| Hipercard (national) | 38,60

Caso vá fazer alguma compra por site ou telefone estrangeiro, saiba que o código pode ter três nomes diferentes: CVD (Card Verification Data), CVN (Card Verification Number) ou CVV (Card Verification Value).
O código é usado como uma validação adicional para as transações em que o cartão não se encontra presente. É um número que não deve ser registrado ou guardado por vendedores, lojas online e sistemas de pagamento virtual.
                                    |
O método getBrand é utilizado para verificar qual a bandeira do cartão que está sendo digitada. Esse método recebe por parâmetro o BIN (seis primeiros dígitos do cartão) e retorna dados como qual a bandeira, o tamanho do CVV, se possui data de expiração e qual algoritmo de validação.
{
       bin: 411111
       config: {acceptedLengths: Array(13, 16, 19), hasDueDate: true, hasCvv: true, hasPassword: false, securityFieldLength: 3}
       cvvSize: 3
       expirable: false
       international: false
       name: "visa"
       validationAlgorithm: "LUHN"
}
 */
