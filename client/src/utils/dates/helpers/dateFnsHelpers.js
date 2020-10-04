// returns a sequence of numbers 1601956800000 indicating the current date and hour. Usuful for comparision of dates in order to know which one is the greatest or the other way around.
const getPureParsedDate = (targetDate, options = {}) => {
    const { isDashed = false, minHour = false } = options;

    if (isDashed) {
        const [year, month, day] = targetDate.split("-");
        const thisFormat = new Date(
            Number(year),
            Number(month - 1),
            Number(day),
            23,
            59,
            59
        );
        targetDate = Date.parse(thisFormat);
    } else {
        const thisTargetDate = new Date(targetDate);
        const day = thisTargetDate.getDate();
        const month = thisTargetDate.getMonth(); // it starts with 0 (january)
        const year = thisTargetDate.getFullYear();

        const thisFormat = minHour
            ? new Date(year, month, day, 0, 0, 0)
            : new Date(year, month, day, 23, 59, 59);
        targetDate = Date.parse(thisFormat);
    }

    return targetDate;
};

// const today = getPureParsedDate(new Date(), { minHour: true });
// const scheduled = getPureParsedDate("2020-10-02", { isDashed: true });
// console.log(today < scheduled) // 1601611200000 1601697599000
export { getPureParsedDate };
