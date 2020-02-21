function convertDotToComma(stringNumber) {
    if(typeof stringNumber !== "string") {
        stringNumber = JSON.stringify(stringNumber);
    }

    let res;

    if(stringNumber.includes(".")) {
        const converted = parseFloat(stringNumber).toFixed(2);
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