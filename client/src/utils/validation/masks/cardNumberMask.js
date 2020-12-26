// mask for credit cards like 4342 1232 3213 2322
export default function cardNumberMask(cardNumber = "") {
    if (!cardNumber) return;

    return cardNumber
        .replace(/\D/g, "")
        .replace(/^(\d{4})(\d)/g, "$1 $2")
        .replace(/^(\d{4})\s(\d{4})(\d)/g, "$1 $2 $3")
        .replace(/^(\d{4})\s(\d{4})\s(\d{4})(\d)/g, "$1 $2 $3 $4");
}
