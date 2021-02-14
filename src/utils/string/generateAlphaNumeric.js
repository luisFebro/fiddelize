import getOnlyConsonants from "./getOnlyConsonants";
// reference: https://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
export default function generateAlphaNumeric(length = 7, chars = "aA#!@") {
    let mask = "";
    if (chars.indexOf("a") > -1) mask += "bcdfghjklmnpqrstvwxyz";
    if (chars.indexOf("A") > -1) mask += "BCDFGHJKLMNPQRSTVWXYZ";
    if (chars.indexOf("#") > -1) mask += "0123456789";
    if (chars.indexOf("!") > -1) mask += "+"; // '~`!@##$%^&*()_+-={}[]:";\'<>?,./|\\' do not insert + for url since it will be a blank space after http request
    if (chars.indexOf("@") > -1) mask += "#@"; // '~`!@##$%^&*()_+-={}[]:";\'<>?,./|\\';
    let result = "";
    for (let i = length; i > 0; --i)
        result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}

// Customized Functions
const getUniqueCodeName = (name) => {
    let finalName;

    // the length of 7 can not change due to consider now the eighth digit as the
    // person who registered the user.
    const TOTAL_CONSONANTS = 3;
    const TOTAL_CODE = 4;

    const onlyConsonantsFromBizName = getOnlyConsonants(name, TOTAL_CONSONANTS);
    const alphaNumeric = generateAlphaNumeric(TOTAL_CODE, "aA#");

    finalName = `${onlyConsonantsFromBizName}${alphaNumeric}`;

    return finalName;
};

export { getUniqueCodeName };

// Other working exemple:
// const length = 11; // max lenght is 11 characters.
// const until11alphanumericGenerator = Math.random().toString(36).substr(2, length)
