import DateFnsUtils from "@date-io/date-fns";
import ptBR from 'date-fns/locale/pt-BR';
import format from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';
import formatRelative from 'date-fns/formatRelative';
import addDays from 'date-fns/addDays';

const localeObj = {
    default: ptBR,
    ptBR,
}

const dateFnsUtils = DateFnsUtils;
const ptBRLocale = ptBR;

// tools
const pick = locale => locale ? localeObj[locale] : localeObj.default;
const now = new Date();
//
//month should be capitalized
const formatDMY = (date, locale) => format(convertUTCToLocale(date), "do 'de' MMMM, yyyy", { locale: pick(locale) });
const fromNow = (pastDate, locale) => formatDistance(new Date(pastDate), now, { addSuffix: true, locale: pick(locale) })
// calendar needs a customformatlike ``{ sameElse: 'll'}`` in moment.
const calendar = (date, locale) => formatRelative(new Date(date), now, { locale: pick(locale) })

export {
    dateFnsUtils,
    ptBRLocale,
    formatDMY,
    fromNow,
    calendar,
    addDays,
}

// reference: https://stackoverflow.com/questions/6525538/convert-utc-date-time-to-local-date-time
function convertUTCToLocale(date) {
    if(typeof date === "string") {
        date = new Date(date);
    }

    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
}