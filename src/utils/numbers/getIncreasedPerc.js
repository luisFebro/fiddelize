// get increased percentage
// reference: https://www.calculatorsoup.com/calculators/algebra/percentage-increase-calculator.php
export default function getIncreasedPerc(startingVal, finalVal) {
    if (typeof startingVal !== "number") {
        startingVal = Number(startingVal);
    }
    if (typeof finalVal !== "number") {
        finalVal = Number(finalVal);
    }
    const isBothNegative =
        startingVal < 0 && finalVal < 0 && startingVal < finalVal; // startingVal < finalVal makes sure the start is the least and has an increase

    // switching starting values with negative
    if (startingVal < 0) {
        const thisNewInitial = Math.abs(startingVal);
        const thisNewFinal = thisNewInitial * 2 + finalVal;
        startingVal = thisNewInitial;
        finalVal = thisNewFinal;
    }

    if (startingVal === 0) {
        return Number(`${finalVal}0`);
    }

    const diff = finalVal - startingVal;
    const division = diff / startingVal;

    let finalValue = (division * 100).toFixed(2);

    // if both values are negative, then it is positive increase
    if (isBothNegative) {
        finalValue = Math.abs(finalValue);
    }

    return finalValue;
}
