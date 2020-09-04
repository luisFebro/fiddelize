import { startWeek, endWeek } from "./dateFns";

function getDay() {
    const now = new Date();
    return now.getDate();
}

function getWeekCode() {
    const startWeekDay = startWeek.getDate();
    const endWeekDay = endWeek.getDate();
    const startMonth = startWeek.getMonth() + 1;
    const startYear = startWeek.getFullYear();

    return `w:${startWeekDay}_${endWeekDay}.m:${startMonth}.y:${startYear}`;
}

function getMonth() {
    const now = new Date();
    return now.getMonth() + 1; // january starts with zero.
}

function getMonthCode() {
    const currMonth = getMonth();
    const currYear = getYear();

    return `m:${currMonth}.y:${currYear}`;
}

function getYear() {
    const now = new Date();
    return now.getFullYear();
}

export { getDay, getMonth, getYear, getWeekCode, getMonthCode };

export default function getFilterDate() {
    const day = getDay();
    const week = getWeekCode();
    const month = getMonthCode();
    const year = getYear();

    return { day, week, month, year };
}
