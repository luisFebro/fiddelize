// Check both string and number;
// Great to check where to insert a float number or not
export default function isInteger(number) {
    return Number.isInteger(parseFloat(number));
}

