import getOnlyConsonants from './getOnlyConsonants';
// reference: https://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
export default function generateAlphaNumeric(length = 7, chars = 'aA#!@') {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'bcdfghjklmnpqrstvwxyz';
    if (chars.indexOf('A') > -1) mask += 'BCDFGHJKLMNPQRSTVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '+';//'~`!@##$%^&*()_+-={}[]:";\'<>?,./|\\';
    if (chars.indexOf('@') > -1) mask += '#@';//'~`!@##$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}


// Customized Functions
const getUniqueCodeName = name => {
    let finalName;
    const onlyConsonants = getOnlyConsonants(name, 3);
    const alphaNumeric = generateAlphaNumeric(4, 'aA#');

    finalName = `${onlyConsonants}${alphaNumeric}`;

    return finalName;
}

export { getUniqueCodeName };

// Other working exemple:
// const length = 11; // max lenght is 11 characters.
// const until11alphanumericGenerator = Math.random().toString(36).substr(2, length)