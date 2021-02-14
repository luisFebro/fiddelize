// this function is good for many values to know each percetage out of a total value
// e.g total 100 for 4 parts gives back 25 (a number)
export default function getPercentage(targetValue, curValue) {
    if (typeof targetValue !== "number") {
        targetValue = Number(targetValue);
    }
    if (typeof curValue !== "number") {
        curValue = Number(curValue);
    }

    if (!curValue) {
        return 0;
    }

    if (curValue > targetValue) {
        return 100;
    }
    let perc = (curValue / targetValue) * 100;
    const isInteger = Number.isInteger(parseFloat(perc));
    perc = isInteger ? perc.toFixed(0) : perc.toFixed(1);
    return parseFloat(perc);
}
