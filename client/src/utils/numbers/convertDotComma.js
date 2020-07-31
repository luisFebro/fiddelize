function convertDotToComma(stringNumber, options = {}) {
    const { needFixed = true } = options;

    if(!stringNumber && stringNumber !== 0) return;
    if(typeof stringNumber !== "string") {
        stringNumber = JSON.stringify(stringNumber);
    }

    let res;

    if(stringNumber.includes(".")) {
        const converted = needFixed ? parseFloat(stringNumber).toFixed(2) : parseFloat(stringNumber).toString();
        res = converted.replace(".", ",")
        return res;
    } else {
        return stringNumber;
    }
}

function convertCommaToDot(stringNumber) {
    if(typeof stringNumber !== "string") {
        stringNumber = JSON.stringify(stringNumber);
    }

    return stringNumber.includes(",")
    ? stringNumber.replace(",", ".")
    : stringNumber;
}

export { convertDotToComma, convertCommaToDot };