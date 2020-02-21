/**
 * [getDayMonth description]
 * @param  {string} date new Date
 * @return {string}
 */
export default function getDayMonthBr(stringDate) {
    const selectedDate = new Date(stringDate);

    let dayMonth;
    let monthes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const ind = selectedDate.getMonth();
    const selectedMonth = monthes[ind];

    let day = selectedDate.getDate();
    if(day === 1){
        day = `1º`;
    }

    dayMonth = `${day} de ${selectedMonth}`;

    return dayMonth;
}
