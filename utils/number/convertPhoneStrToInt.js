function convertPhoneStrToInt(phoneStr) {
    if(!phoneStr || typeof phoneStr !== 'string') throw new Error("No phone as string found as argument")
    let newIntNumber;
    const removedCharReg = /\D/gi;
    newIntNumber = phoneStr.replace(removedCharReg, "");
    return Number(newIntNumber);
}

module.exports = convertPhoneStrToInt;