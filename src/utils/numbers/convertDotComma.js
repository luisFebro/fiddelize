// better option to convert than below ones.
const convertBrToDollar = (str) => {
    if (!str) return console.log("No number string");

    if (typeof str !== "string") {
        str = str.toString();
    }

    const formatted = str.replace(/\./gi, "").replace(/\,/gi, ".");

    return Number(formatted);
};

function convertDotToComma(stringNumber, options = {}) {
    const { needFixed = true } = options;

    if (!stringNumber && stringNumber !== 0) return;
    if (typeof stringNumber !== "string") {
        stringNumber = JSON.stringify(stringNumber);
    }

    let res;

    if (stringNumber.includes(".")) {
        const converted = needFixed
            ? parseFloat(stringNumber).toFixed(2)
            : parseFloat(stringNumber).toString();
        res = converted.replace(".", ",");
        return res;
    }
    return stringNumber;
}

function convertCommaToDot(stringNumber) {
    if (typeof stringNumber !== "string") {
        stringNumber = JSON.stringify(stringNumber);
    }

    return stringNumber.includes(",")
        ? stringNumber.replace(",", ".")
        : stringNumber;
}

export { convertBrToDollar, convertDotToComma, convertCommaToDot };
