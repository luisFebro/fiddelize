export default function getWeekDayBr(newDate) {
    let day;
    const weekDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const date = newDate ? new Date(newDate) : new Date();
    const ind = date.getDay();
    day = weekDays[ind];

    return day;
}