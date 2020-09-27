export default function getIncreasedPerc(startingVal, finalVal) {
    const diff = finalVal - startingVal;
    const division = diff / startingVal;
    return (division * 100).toFixed(2);
}
