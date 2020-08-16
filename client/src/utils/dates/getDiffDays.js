// reference: https://stackoverflow.com/questions/2627473/how-to-calculate-the-number-of-days-between-two-dates

export default function getDiffDays(targetDate, options = {}) {
const { countdownLimit /*number*/ } = options;
    // e.g date format new Date(2020, 12 (month), 31 (day))
    if(typeof targetDate === "string") targetDate = new Date(targetDate);
    if(!targetDate) targetDate = new Date();
    const currDate = new Date();

    const didPassCurrDate = (currDate > targetDate) ? true : false;
    if(didPassCurrDate) return 0;

    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.ceil(Math.abs((currDate - targetDate) / oneDay));

    if(diffDays < 0) return 0;

    return diffDays;
}

// e.g
// const res = getDiffDays("Thu Aug 20 2020 02:52:42 GMT-0400 (Amazon Standard Time)", { countdownLimit: 36 })
// console.log("res", res);