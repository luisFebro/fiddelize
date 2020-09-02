
// reference: https://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
function generateAlphaNumeric(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'bcdfghjklmnpqrstvwxyz';
    if (chars.indexOf('A') > -1) mask += 'BCDFGHJKLMNPQRSTVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '+';//'~`!@##$%^&*()_+-={}[]:";\'<>?,./|\\';
    if (chars.indexOf('@') > -1) mask += '@';//'~`!@##$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}

module.exports = generateAlphaNumeric;

// Other working exemple:
// const length = 11; // max lenght is 11 characters.
// const until11alphanumericGenerator = Math.random().toString(36).substr(2, length)
//
/*
const generatePlanCodes = () => {
    const codesObj = { bronze: null, silver: null, gold: null };
    let plan;
    for(plan in codesObj) {
        codesObj[plan] = generateAlphaNumeric(7, '#aA')
    }

    return codesObj;
}
// */