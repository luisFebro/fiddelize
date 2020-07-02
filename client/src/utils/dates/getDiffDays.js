// reference: https://stackoverflow.com/questions/2627473/how-to-calculate-the-number-of-days-between-two-dates

export default function getDiffDays(firstDate, secondDate, options = {}) {
const { countdownLimit /*number*/ } = options;
    // e.g date format new Date(2020, 12 (month), 31 (day))
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    secondDate
    ? secondDate
    : secondDate = new Date();

    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

    if(countdownLimit && countdownLimit >= diffDays) return countdownLimit - diffDays;
    if(countdownLimit && countdownLimit < diffDays) return 0;

    return diffDays;
}

// e.g
// const res = getDiffDays(new Date(2020, 6, 1), new Date(2020, 6, 21), { countdownLimit: 30 })
// console.log("res", res); // 10