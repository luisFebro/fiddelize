const removeDiacritics = require("./removeDiacritics");

// remove all diacritics (acentos pt-br), then replace globally any space or symbols like @, not including (_, a-Z, 0-9)
function addDashesToString(string) {
    string = removeDiacritics(string);
    return string.replace(/(\s|\W)/gi, "-").toLowerCase(); // L
}

module.exports = addDashesToString;

/* COMMENTS
n1:\W replaces all non-words including @, #, +, etc. So this is not a good idea to use with alphanumeric sequences containing these symbols
123@sa gets replaced by: 123-sa
*/
