var bcrypt = require('bcryptjs');
const crypto = require('crypto');

// BCRYPT FOR DB PASSWORDS
async function hashPassword(pass) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pass, salt);

        return hash;
    } catch(e) {
        console.log(e);
    }
}

async function comparePassword(pass, hash) {
    return bcrypt.compare(pass, hash);
}

// ex:
// hashPassword("Hello").then(res => console.log(res))
// const hash = "$2a$10$wmiNmOYZ9o2acsyoPa.EyODqM9q7iUehbw8AAID3vOrB5.Jo86z7."
// comparePassword("Hello", hash).then(res => console.log(res));
// END BCRYPT FOR DB PASSWORDS

// ENCRYPTION AND DECRYPTION
function encrypt(text) { // criptografar
    const promiseEncrypt = (resolve, reject) => {
        const run = () => {
            const iv = crypto.randomBytes(IV_LENGTH);
            const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(KRYPTO_SECRET), iv);
            let encrypted = cipher.update(text);

            encrypted = Buffer.concat([encrypted, cipher.final()]);

            return iv.toString('hex') + ':' + encrypted.toString('hex');
        }

        try {
            resolve(run())
        } catch(e) {
            reject(e);
        }
    }

    return new Promise(promiseEncrypt);
}


function decrypt(hashTxt) {
    const promiseDecript = (resolve, reject) => {
        const run = () => {
            const textParts = hashTxt.split(':');
            const iv = Buffer.from(textParts.shift(), 'hex');
            const encryptedText = Buffer.from(textParts.join(':'), 'hex');
            const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(KRYPTO_SECRET), iv);
            let decrypted = decipher.update(encryptedText);

            decrypted = Buffer.concat([decrypted, decipher.final()]);

            return decrypted.toString();
        }

        try {
            resolve(run());
        } catch(e) {
            reject(e);
        }
    }

    return new Promise(promiseDecript);
}

encrypt("c")
.then(res => console.log(res))

decrypt("1f3d4149c0bbd3be485529afb26aced:3f0993e834ca8d5a2084a5c31cc24228")
.then(res => {
    console.log(res);
})
.catch(e => console.log(e))

// END ENCRYPTION AND DECRYPTION


module.exports = { encrypt, decrypt, hashPassword, comparePassword }; // both returns string







const KRYPTO_SECRET = process.env.KRYPTO_SECRET; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

// reference:
// https://vancelucas.com/blog/stronger-encryption-and-decryption-in-node-js/
// more: https://www.sohamkamani.com/nodejs/rsa-encryption/

/* ARCHIVES
https://stackoverflow.com/questions/18279141/javascript-string-encryption-and-decryption
const handleCipherVault = salt => {
    if(!salt) return;
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
    if(!salt) return;
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

const { cipherThis, decipherThis, compareThis } = require("./utils/security/xCipher");
const resCipher = cipherThis('023.248.892-42');
console.log("resCipher", resCipher);
const resDecipher = decipherThis(resCipher);
console.log("resDecipher", resDecipher);
const res = compareThis({ str: '023.248.892-42', cipher: "1b191805191f1305131219061f19" });
console.log("resCompare", res);
 */


/* COMMENTS
n1: add cipher (myCpf + 1) add + 1 at hte very end of decipher krypto_secret and faces will be displayed.
*/