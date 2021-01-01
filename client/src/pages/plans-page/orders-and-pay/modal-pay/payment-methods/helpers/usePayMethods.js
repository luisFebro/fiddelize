import { useState, useEffect } from "react";
//Esse método recebe opcionalmente o valor da transação e retorna um JSON contendo os meios de pagamento disponíveis, compatíveis com o valor informado. Caso não seja informado o valor, será retornado todos os meios de pagamento.
// Observe que os meios de pagamento Balance e Deposit são retornados, porém atualmente não podem ser implementados.
// Com essas informações você poderá apresentar as opções para pagamento ao comprador.

function getAvailableAssets(collection) {
    const availableAssets = [];

    for (const asset in collection) {
        const { status, name, images, displayName, code } = collection[asset];
        const isAvailable = status === "AVAILABLE";
        if (isAvailable) {
            availableAssets.push({
                name: name && name.toLowerCase(),
                displayName,
                code,
                image: `https://stc.pagseguro.uol.com.br/${images.MEDIUM.path}`,
            });
        }
    }

    return availableAssets;
}

export default function usePayMethods(target, value) {
    const [payMethod, setPayMethod] = useState(null);

    const targets = ["CREDIT_CARD", "ONLINE_DEBIT"];

    if (!targets.includes(target)) throw new Error("target not valid");

    const PagSeguro = window.PagSeguroDirectPayment;
    useEffect(() => {
        if (payMethod) return;
        PagSeguro.getPaymentMethods({
            amount: value, // returns all methods if not defined.
            success: function (response) {
                const allOptions = response.paymentMethods[target].options;
                const assetAvailable = getAvailableAssets(allOptions);
                setPayMethod(assetAvailable);
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
