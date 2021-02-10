// reference: https://pt.stackoverflow.com/questions/181922/formatar-moeda-brasileira-em-javascript
// cifrão in English: money sign or formal currency sign.
// Brasilian description: “it’s a capital R followed by the money sign”

export default function convertToReal(number, options = {}) {
    if (!number && number !== 0) return;
    if (number.toString().indexOf(",") > 0)
        return console.log("the number should not contain a comma");

    const {
        moneySign = false,
        needFraction = false,
        // toDefault = false, // transform back to american format (later update)
        comma = false,
    } = options;

    if (typeof number === "string") {
        // n1
        number = Number(number);
        if (Number.isNaN(number)) return;
    }

    let res;

    const config = moneySign
        ? {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: needFraction ? 2 : 0,
          }
        : { minimumFractionDigits: needFraction ? 2 : 0 };

    res = number.toLocaleString("pt-BR", config);

    const needComma = (number) => number < 1000 && comma;
    if (needComma(number)) {
        res = res.toString().replace(".", ",");
    }

    return res; // n2
}

/* COMMENTS
n1: although the function returns as a string, the target value should be a number.
otherwise, no effect will be made.
n2: returns a string.
*/

// TESTS
// const test1 = convertToReal('60.45');
// console.log("test1", test1);
// const test2 = convertToReal(60.45);
// console.log("test2", test2);
// const test3 = convertToReal(60.45, { moneySign: false })
// console.log("test3", test3);
// const test4 = convertToReal(undefined, { moneySign: false })
// console.log("test4", test4);
// const test5 = convertToReal(1500, { moneySign: false })
// console.log("test5", test5);
// const test6 = convertToReal(1600, { needFraction: false })
// console.log("test6", test6);

// RESULTS
// test1 R$ 60,45
// test2 R$ 60,45
// test3 60,45
// test4 need a number as the first parameter
// test5 1,500.00
// test6 R$ 1,600
