export default function getIntOrFloat(number) {
    let res;
    // validation
    const isValidFormat = parseFloat(Number(number)) || Number(number) === 0;
    if (!isValidFormat)
        throw new Error(
            "The number's argument should be in a numerical format. Numerical string is accept"
        );
    number = Number(number);
    // end validation

    const isInteger = Number.isInteger(parseFloat(number));
    isInteger
        ? (res = parseInt(number))
        : (res = parseFloat(number).toFixed(2));

    return res;
}
