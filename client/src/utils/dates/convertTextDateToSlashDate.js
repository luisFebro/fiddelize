const getMonthNumber = {
    janeiro: "01",
    fevereiro: "02",
    março: "03",
    abril: "04",
    maio: "05",
    junho: "06",
    julho: "07",
    agosto: "08",
    setembro: "09",
    outubro: "10",
    novembro: "11",
    dezembro: "12",
};

export default function convertTextDateToSlashDate(date) {
    if (!date) return;

    const [day, monthTxt, year] = date.split(" de ");

    const month = getMonthNumber[monthTxt.toLowerCase()];
    return `${day}/${month}/${year}`;
}

// Example:
// const res = convertTextDateToSlashDate(date);
// const date = "23 de Agosto de 1994"
// console.log("res", res); // 23/08/1994
