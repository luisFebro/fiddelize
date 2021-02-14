// reference: https://stackoverflow.com/questions/563406/add-days-to-javascript-date
// using from date-dns

export default function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);

    return result;
}

// console.log(addDays(new Date(), 365)); // 2021-07-02T06:56:02.903Z
