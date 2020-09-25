export default function getOnlyNumbersFromStr(strNumber, options = {}) {
    if (!strNumber || typeof strNumber !== "string")
        return console.log("No phone as string found as argument");

    let onlyNumbers;

    const removedCharReg = /\D/gi;
    onlyNumbers = strNumber.replace(removedCharReg, "");

    return onlyNumbers;
}
