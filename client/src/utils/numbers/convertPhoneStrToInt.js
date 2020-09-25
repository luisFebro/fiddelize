export default function convertPhoneStrToInt(phoneStr, options = {}) {
    const { dddOnly = false, phoneOnly = false } = options;
    if (!phoneStr || typeof phoneStr !== "string")
        return console.log("No phone as string found as argument");

    if (dddOnly) {
        return phoneStr.slice(1, 3);
    }

    const removedCharReg = /\D/gi;
    if (phoneOnly) {
        const thisOnlyPhone = phoneStr.slice(4);
        return thisOnlyPhone.replace(removedCharReg, "");
    }

    let newIntNumber;
    newIntNumber = phoneStr.replace(removedCharReg, "");
    return Number(newIntNumber);
}

// const res = convertPhoneStrToInt("(92) 09281-7360", { phoneOnly: true });
// console.log("res", res);
