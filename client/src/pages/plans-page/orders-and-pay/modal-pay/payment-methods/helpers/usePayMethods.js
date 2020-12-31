import { useState, useEffect } from "react";
//Esse método recebe opcionalmente o valor da transação e retorna um JSON contendo os meios de pagamento disponíveis, compatíveis com o valor informado. Caso não seja informado o valor, será retornado todos os meios de pagamento.
// Observe que os meios de pagamento Balance e Deposit são retornados, porém atualmente não podem ser implementados.
// Com essas informações você poderá apresentar as opções para pagamento ao comprador.

function getAvailableCards(collection) {
    const availableCards = [];

    for (const card in collection) {
        const { status, name, images, code } = collection[card];
        const isAvailable = status === "AVAILABLE";
        if (isAvailable) {
            availableCards.push({
                name: name && name.toLowerCase(),
                code,
                image: `https://stc.pagseguro.uol.com.br/${images.MEDIUM.path}`,
            });
        }
    }

    return availableCards;
}

export default function usePayMethods(target, value) {
    const [payMethod, setPayMethod] = useState(null);

    const targets = ["CREDIT_CARD", "ONLINE_DEBT"];

    if (!targets.includes(target)) throw new Error("target not valid");

    const PagSeguro = window.PagSeguroDirectPayment;
    useEffect(() => {
        if (payMethod) return;
        PagSeguro.getPaymentMethods({
            amount: value, // returns all methods if not defined.
            success: function (response) {
                const allOptions = response.paymentMethods[target].options;
                const cardsAvailable = getAvailableCards(allOptions);
                setPayMethod(cardsAvailable);
            },
            error: function (response) {
                console.log("Callback para chamadas que falharam", response);
            },
            complete: function (response) {
                // console.log("Callback para todas chamadas", response);
            },
        });
    }, []);

    return payMethod;
}
