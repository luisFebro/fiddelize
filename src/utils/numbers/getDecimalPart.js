// reference: https://stackoverflow.com/questions/4512306/get-decimal-portion-of-a-number-with-javascript
// e.g 100.90 = 0.90
export default function getDecimalPart(n) {
    n = Math.abs(n); // Change to positive, if negative
    const decimal = n - Math.floor(n)
    return decimal.toFixed(2);
}