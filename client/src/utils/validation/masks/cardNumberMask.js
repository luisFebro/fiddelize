// mask for credit cards like 4342 1232 3213 2322
// accept up to 19 characters for some cards which these larger cases
// https://www.nccgroup.com/uk/about-us/newsroom-and-events/blogs/2016/november/prepare-for-19-digit-credit-cards/
export default function cardNumberMask(cardNumber = "") {
    if (!cardNumber) return;

    return cardNumber
        .replace(/\D/g, "")
        .replace(/^(\d{4})(\d)/g, "$1 $2")
        .replace(/^(\d{4})\s(\d{4})(\d)/g, "$1 $2 $3")
        .replace(/^(\d{4})\s(\d{4})\s(\d{4})(\d)/g, "$1 $2 $3 $4")
        .replace(/^(\d{4})\s(\d{4})\s(\d{4})\s(\d{4})(\d)/g, "$1 $2 $3 $4 $5");
}
