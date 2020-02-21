export default function getWeekDayBr() {
    let day;
    const weekDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const date = new Date();
    const ind = date.getDay();
    day = weekDays[ind];

    return day;
}