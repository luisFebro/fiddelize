import treatZero from "./treatZero";

export default function getDashYearMonthDay(date) {
    if (!date) return;

    const newDate = date.toLocaleString(); // 9/28/2020, 2:18:55 PM - I used addDays before to generate this date format.
    const indSpace = newDate.indexOf(",");
    const dirtyDate = newDate.slice(0, indSpace); // e.g 2020-9-2
    const treatedDate = dirtyDate.split("/").map((num) => treatZero(num));
    const [month, day, year] = treatedDate;

    return `${year}-${month}-${day}`; // e.g 2020-09-02
}
