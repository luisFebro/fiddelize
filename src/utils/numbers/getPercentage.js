// this function is good for many values to know each percetage out of a total value
// getPercentage(300, 10, { mode: "perc" }) === 3,3 (%)
// getPercentage(300, 10, { mode: "value" }) === 30 (value)
export default function getPercentage(targetValue, curValue, options = {}) {
    const { mode = "perc", moreThan100 = false, toFixed } = options; // mode: perc|value

    if (typeof targetValue !== `number`) {
        targetValue = Number(targetValue);
    }
    if (typeof curValue !== `number`) {
        curValue = Number(curValue);
    }

    if (mode === "value" && curValue > 100) {
        return console.log(
            "ERROR: the second param should be a percentage value from 0 to 100"
        );
    }

    if (!curValue) {
        return 0;
    }

    if (mode === "perc" && !moreThan100 && curValue > targetValue) {
        return 100;
    }

    const perc = (curValue / targetValue) * 100;
    const value = (curValue / 100) * targetValue;

    let number = mode === "perc" ? perc : value;

    const isInteger = Number.isInteger(parseFloat(number));
    number = isInteger ? number.toFixed(0) : number.toFixed(toFixed || 1);
    return parseFloat(number);
}
