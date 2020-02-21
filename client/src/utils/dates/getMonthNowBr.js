export default function getMonthNowBr(thisDate = null) {
    const selectedDate = thisDate && new Date(thisDate) || new Date();

    let monthes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const ind = selectedDate.getMonth();
    const selectedMonth = monthes[ind];
    return selectedMonth;
}