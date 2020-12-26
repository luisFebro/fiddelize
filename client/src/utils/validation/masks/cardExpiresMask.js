// reference: https://stackoverflow.com/questions/45259196/javascript-regex-credit-card-expiry-date-auto-format
// MM / YY auto format
export default function cardExpiresMask(valDate = "") {
    if (!valDate) return;

    return valDate
        .replace(/[^0-9]/g, "") // To allow only numbers
        .replace(/^([2-9])$/g, "0$1") // To handle 3 > 03
        .replace(/^(1{1})([3-9]{1})$/g, "0$1 / $2") // 13 > 01/3
        .replace(/^0{1,}/g, "0") // To handle 00 > 0
        .replace(/^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g, "$1 / $2"); // To handle 113 > 11/3
}

/* EXAMPLE
console.log(cardExpiresMask("0112")) // 01 / 12

*/
