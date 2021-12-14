import data from "./dataWorkingHour";

export default function isWorkingHour(openHour = 9, closeHour = 18) {
    const weekDayBr = checkTodayDay(data);

    const isRestDay = weekDayBr === "Domingo";
    if (isRestDay) return false;

    const hourNow = new Date().getHours();
    const isWithWorkingHour = hourNow >= openHour && hourNow < closeHour;

    if (isWithWorkingHour) return true;
    return false;
}

// HELPERS
function checkTodayDay(weekDays = []) {
    const date = new Date();
    const { weekDay } = weekDays.find((d, ind) => date.getDay() === ind);
    return weekDay;
}
// END HELPERS
