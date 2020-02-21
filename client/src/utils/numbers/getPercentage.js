// return number
export default function getPercentage(targetValue, curValue) {
    if(!curValue) {
        return 0;
    }

    if(curValue > targetValue) {
        return 100;
    }
    let perc = (curValue / targetValue) * 100;
    const isInteger = Number.isInteger(parseFloat(perc));
    perc = isInteger ? perc.toFixed(0) : perc.toFixed(1)
    return parseFloat(perc);
}