/**
 * [getDayMonth description]
 * @param  {string} date new Date
 * @return {string}
 */

 const treatZero = (number) => {
     if(Number(number) <= 9) {
         return `0${number}`;
     }
     return number;
 }

export default function getDayMonthBr(stringDate, options = {}) {
    const { needYear, short } = options;
    const selectedDate = new Date(stringDate);

    let dayMonth;
    let monthes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const ind = selectedDate.getMonth();
    const selectedMonth = monthes[ind];

    let day = selectedDate.getDate();
    if(day === 1){
        day = `1º`;
    }

    if(needYear) {
        const year = selectedDate.getFullYear();
        if(short) {
            const month = treatZero(ind + 1);
            dayMonth = `${treatZero(day)}/${month}/${year}`;
        } else {
            dayMonth = `${day} de ${selectedMonth} de ${year}`;
        }
    } else {
        dayMonth = `${day} de ${selectedMonth}`;
    }


    return dayMonth;
}
