const removeDiacritics = require('./removeDiacritics');

// remove all diacritics (acentos pt-br), then replace globally any space or symbols like @, not including (_, a-Z, 0-9)
function addDashesToString(string) {
    string = removeDiacritics(string);
    return string.replace(/(\s|\W)/gi, "-").toLowerCase();
}

module.exports = addDashesToString;
