const CryptoAES = require("crypto-js/aes");
const encUtf8 = require("crypto-js/enc-utf8");

const KRYPTO_SECRET = `${process.env.REACT_APP_KRYPTO_SECRET}`;

function encrypt(data, options = {}) {
    const { isObj = false } = options;

    if (!data) return console.log("No data. need some data to encrypt.");

    const finalData = isObj ? JSON.stringify(data) : data;
    return CryptoAES.encrypt(finalData, KRYPTO_SECRET).toString();
}

function decrypt(ciphertext, options = {}) {
    const { isObj = false } = options;

    if (!ciphertext) return console.log("No ciphertext.");

    const bytes = CryptoAES.decrypt(ciphertext, KRYPTO_SECRET);

    if (isObj) {
        return JSON.parse(bytes.toString(encUtf8));
    }

    return bytes.toString(encUtf8);
}

export { encrypt, decrypt };

// TEST
// const encrypted = encrypt("Fuck you!")
// console.log(encrypted); // U2FsdGVkX1++XUvHwpsSwey01ULW6StBhpeGUYX+gEs=
// console.log(decrypt(encrypted)); // 'my message'
