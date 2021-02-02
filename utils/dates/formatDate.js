const format = require("date-fns/format");
// parse only date from an ISO format.
function formatDate(date) {
    if (!date) return;
    // 2021-02-01T04:00:00.000Z
    const formatThisDate = (newDate = new Date()) =>
        format(newDate, "yyyy-MM-dd");
    return formatThisDate(date);
}

module.exports = formatDate;
// the diff between this func and toLocaleDateString() which returns the same thing
// is the critical factor:
//2021-2-1
// my func => 2021-2-01

// the native method wheeps out the zero which makes a critical diff in a DB query
