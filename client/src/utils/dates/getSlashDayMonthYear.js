// the input need to be aaaa-mm-dd format.
export default function getSlashDayMonthYear(dateStr) {
    if (!dateStr) return;
    if (typeof dateStr !== "string") dateStr = dateStr.toString();

    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year.slice(2)}`;
}
