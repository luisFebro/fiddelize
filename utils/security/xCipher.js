// reference :https://stackoverflow.com/questions/18279141/javascript-string-encryption-and-decryption
// cipher and decipler strings to store safely.

const handleCipherVault = salt => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);

    return text => text.split('')
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join('');
}

const handleDecipherVault = salt => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);
    return encoded => encoded.match(/.{1,2}/g)
        .map(hex => parseInt(hex, 16))
        .map(applySaltToChar)
        .map(charCode => String.fromCharCode(charCode))
        .join('');
}

const KRYPTO_SECRET = process.env.KRYPTO_SECRET;
const cipherThis = handleCipherVault(KRYPTO_SECRET);
const decipherThis = handleDecipherVault(KRYPTO_SECRET);

function compareThis(options = {}) {
    const { str = "", cipher = "" } = options;
    if(!str || !cipher) return console.log("Missing str or cipher params")
    if(typeof str !== "string" || typeof cipher !== "string") return console.log("parameters should be obj with string as value")

    const thisCipher = cipherThis(str);
    return thisCipher === cipher;
}


module.exports = { cipherThis, decipherThis, compareThis }; // both returns string




/* COMMENTS
n1: add cipher (myCpf + 1) add + 1 at hte very end of decipher krypto_secret and faces will be displayed.
*/