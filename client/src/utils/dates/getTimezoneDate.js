// reference: https://metring.com.br/data-e-hora-em-tempo-real-com-javascript
// choose timezone: https://momentjs.com/timezone/

const getConfig = ({ mode, hour12 }) => {
    switch(mode) {
        case "hour":
            return({
                timeZone: 'America/Sao_Paulo',
                hour: 'numeric',
                minute: 'numeric',
                hour12,
            })
        case "date":
            return null;
        default:
            return console.log("Smt wrong with getConfig")
    }
}

export default function getTimezoneDate(mode = "hour", options = {}) {

    const {
        hour12 = false,
        locale = "pt-BR",
        newDate = new Date(),
    } = options;

    const config = getConfig({ mode, hour12 });

    const date = new Intl.DateTimeFormat(locale, config);
    return date.format(new Date(newDate)); // n1

}

// ex:
// console.log(getTimezoneDate("hour", { newDate: "2020-08-08T03:23:52.472Z" }));

/* COMMENTS
n1:
NOTE 1:
// Brazil timeZones:
America/Manaus --
America/Campo_Grande (mato grosso do sul same hour than Manaus)
America/Boa_Vista
America/Acre (1 hour before)
America/Santarem (Para 1 hour after)

NOTE 2:
Estados têm até três horas de diferença com relação a Brasília

NOTE 3:
São os seguintes os estados que seguem o horário oficial de Brasília: Espírito Santo, Goiás, Minas Gerais, Paraná, Rio de Janeiro, Rio Grande do Sul, Santa Catarina, SÃO PAULO.

NOTE 4:
Já o Acre, que tem DUAS horas a menos que Brasília. Com horário de verão chega a 3 horas em Outubro.
*/

// The Intl.DateTimeFormat object is a constructor for objects that enable language-sensitive date and time formatting.
// reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat

// sometimes even the US needs 24-hour time
// const dateTest = new Date(Date.UTC(2012, 11, 20, 3, 0, 0, 200));
// const options = {
//   year: 'numeric', month: 'numeric', day: 'numeric',
//   hour: 'numeric', minute: 'numeric', second: 'numeric',
//   hour12: false,
//   timeZone: 'America/Los_Angeles'
// };
// console.log(new Intl.DateTimeFormat('en-US', options).format(dateTest));
// → "12/19/2012, 19:00:00"

