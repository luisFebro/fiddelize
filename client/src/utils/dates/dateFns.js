import DateFnsUtils from "@date-io/date-fns";
import ptBR from 'date-fns/locale/pt-BR';
import format from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';
import formatRelative from 'date-fns/formatRelative';

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
const formatDMY = (date, locale) => format(date, "do 'de' MMMM, yyyy", { locale: pick(locale) });
const fromNow = (pastDate, locale) => formatDistance(new Date(pastDate), now, { addSuffix: true, locale: pick(locale) })
// calendar needs a customformatlike ``{ sameElse: 'll'}`` in moment.
const calendar = (date, locale) => formatRelative(new Date(date), now, { locale: pick(locale) })

export {
    dateFnsUtils,
    ptBRLocale,
    formatDMY,
    fromNow,
    calendar,
}