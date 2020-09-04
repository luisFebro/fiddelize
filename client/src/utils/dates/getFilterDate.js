import { startWeek, endWeek } from "./dateFns";

const getDay = () => {
    const now = new Date();
    return now.getDate();
};

const getWeekCode = () => {
    const startWeekDay = startWeek.getDate();
    const endWeekDay = endWeek.getDate();
    const startMonth = startWeek.getMonth() + 1;

    return `m:${startMonth}.w:${startWeekDay}_${endWeekDay}`;
};

const getMonth = () => {
    const now = new Date();
    return now.getMonth() + 1;
};

const getYear = () => {
    const now = new Date();
    return now.getFullYear();
};

export { getDay, getWeekCode, getMonth, getYear };

export default function getFilterDate() {
    const now = new Date();

    const day = now.getDate();
    const month = now.getMonth() + 1; // january starts with zero.
    const year = now.getFullYear();

    const startWeekDay = startWeek.getDate();
    const endWeekDay = endWeek.getDate();
    const startMonth = startWeek.getMonth() + 1;

    return {
        day,
        week: `m:${startMonth}.w:${startWeekDay}_${endWeekDay}`,
        month,
        year,
    };
}
