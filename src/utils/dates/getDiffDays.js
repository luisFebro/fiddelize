// reference: https://stackoverflow.com/questions/2627473/how-to-calculate-the-number-of-days-between-two-dates

export default function getDiffDays(targetDate, options = {}) {
    const { countdownLimit /* number */ } = options;
    // e.g date format new Date(2020, 12 (month), 31 (day))
    if (typeof targetDate === "string") targetDate = new Date(targetDate);
    if (!targetDate) targetDate = new Date();
    const currDate = new Date();

    const didPassCurrDate = currDate > targetDate;
    if (didPassCurrDate) return 0;

    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.ceil(Math.abs((currDate - targetDate) / oneDay));

    if (diffDays < 0) return 0;

    return diffDays;
}

// e.g if today is 2020-10-03T04:23:55.028Z
// const res = getDiffDays("2020-10-03T05:36:33.092Z")
// console.log("res", res); // 1 (here even if the dates are equal, the the target date is still the largest one, than it will count 1.)
