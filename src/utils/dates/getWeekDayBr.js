export default function getWeekDayBr(newDate = new Date(), options = {}) {
    const { abbrev = false } = options;

    let day;
    const date = newDate ? new Date(newDate) : new Date();
    const ind = date.getDay();

    if (abbrev) {
        const weekDaysAbbrev = [
            "Dom",
            "Seg",
            "Ter",
            "Qua",
            "Qui",
            "Sex",
            "Sab",
        ];
        day = weekDaysAbbrev[ind];
    } else {
        const weekDays = [
            "Domingo",
            "Segunda",
            "Terça",
            "Quarta",
            "Quinta",
            "Sexta",
            "Sábado",
        ];
        day = weekDays[ind];
    }

    return day;
}
