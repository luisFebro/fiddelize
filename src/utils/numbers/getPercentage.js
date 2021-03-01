// this function is good for many values to know each percetage out of a total value
// e.g total 100 for 4 parts gives back 25 (a number)
// also has a mode to return the value in which a perc represents from a total targetValue
// e.g total 200 for 50 (%) returns 100.
export default function getPercentage(targetValue, curValue, options = {}) {
    const { mode = "perc" } = options; // mode: perc|value

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

    if (mode === "perc" && curValue > targetValue) {
        return 100;
    }

    const perc = (curValue / targetValue) * 100;
    const value = (curValue / 100) * targetValue;

    let number = mode === "perc" ? perc : value;

    const isInteger = Number.isInteger(parseFloat(number));
    number = isInteger ? number.toFixed(0) : number.toFixed(1);
    return parseFloat(number);
}
