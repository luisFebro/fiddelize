var bcrypt = require("bcryptjs");
const crypto = require("crypto");

const KRYPTO_SECRET = process.env.KRYPTO_SECRET; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

// BCRYPT FOR DB PASSWORDS
async function createBcryptPswd(pass) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pass, salt);

        return hash;
    } catch (e) {
        console.log(e);
    }
}

async function compareBcryptPswd(pass, options = {}) {
    const { hash } = options;

    return await bcrypt.compare(pass, hash);
}

// ex:
// hashPassword("Hello").then(res => console.log(res))
// const hash = "$2a$10$wmiNmOYZ9o2acsyoPa.EyODqM9q7iUehbw8AAID3vOrB5.Jo86z7."
// comparePassword("Hello", hash).then(res => console.log(res));
// END BCRYPT FOR DB PASSWORDS

// ENCRYPTION AND DECRYPTION
function encrypt(text) {
    // criptografar
    const promiseEncrypt = (resolve, reject) => {
        const run = () => {
            const iv = crypto.randomBytes(IV_LENGTH);
            const cipher = crypto.createCipheriv(
                "aes-256-cbc",
                Buffer.from(KRYPTO_SECRET),
                iv
            );
            let encrypted = cipher.update(text);

            encrypted = Buffer.concat([encrypted, cipher.final()]);

            return iv.toString("hex") + ":" + encrypted.toString("hex");
        };

        try {
            resolve(run());
        } catch (e) {
            reject(e);
        }
    };

    return new Promise(promiseEncrypt);
}

function encryptSync(text) {
    // criptografar
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(KRYPTO_SECRET),
        iv
    );
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(hashTxt) {
    if (!hashTxt) return;
    const promiseDecript = (resolve, reject) => {
        const run = () => {
            const textParts = hashTxt.split(":");
            const iv = Buffer.from(textParts.shift(), "hex");
            const encryptedText = Buffer.from(textParts.join(":"), "hex");
            const decipher = crypto.createDecipheriv(
                "aes-256-cbc",
                Buffer.from(KRYPTO_SECRET),
                iv
            );
            let decrypted = decipher.update(encryptedText);

            decrypted = Buffer.concat([decrypted, decipher.final()]);

            return decrypted.toString();
        };

        try {
            resolve(run());
        } catch (e) {
            reject(e);
        }
    };

    return new Promise(promiseDecript);
}

function decryptSync(hashTxt) {
    if (!hashTxt) return;
    const textParts = hashTxt.split(":");
    const iv = Buffer.from(textParts.shift(), "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(KRYPTO_SECRET),
        iv
    );
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

// console.log(decryptSync("2aa11588694c5cf87e84d9d72d092962:f4bc0cc535647851f6f449a55c95d648"))
// console.log(encryptSync("(92) 99257-6121"))

// TEST
// encrypt("fjskda fsdajfsdlafjsdaklf sdalfjsdalfsda fsadlkfjsdal fsdalkfjsdalkfjdsalk fjdsaklfjsdalkfjdsal fjsadlfjlsdajflkdsjfklds afjkldsafjkldsfjkdsaflds")
// .then(res => console.log(res))

// decrypt("ef4b68527e5c7ba47bf9d46fbf22e6b9:4af17605662877a552b813e0242ae0f82131cfec2de8433f2780c07b5dbe7ec780048947e10337c3fd6f4232ef3477e92b779646903d9b1a5fa52c660e44a44ecd53c05f4f5a12575e55026b2dbf486bf24dea67bcc1e8f267b2b315c287a526fd8374a83687244e407cce66300b2df3875387df940778c67354dc6e37f73373aa16f3d1272ae89905ede7d1485763ef601015300ea5c1669db70ed68f612595")
// .then(res => {
//     console.log(res);
// })
// .catch(e => console.log(e))

// less secure for authentication which requires decryption.
const handleCipherVault = (salt) => {
    if (!salt) return;
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) =>
        textToChars(salt).reduce((a, b) => a ^ b, code);

    return (text) =>
        text
            .split("")
            .map(textToChars)
            .map(applySaltToChar)
            .map(byteHex)
            .join("");
};

const handleDecipherVault = (salt) => {
    if (!salt) return;
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const applySaltToChar = (code) =>
        textToChars(salt).reduce((a, b) => a ^ b, code);
    return (encoded) =>
        encoded
            .match(/.{1,2}/g)
            .map((hex) => parseInt(hex, 16))
            .map(applySaltToChar)
            .map((charCode) => String.fromCharCode(charCode))
            .join("");
};

const jsEncrypt = handleCipherVault(KRYPTO_SECRET);
const jsDecrypt = handleDecipherVault(KRYPTO_SECRET);

// TEST
// const resCipher = jsEncrypt('023.248.892-42');
// console.log("resCipher", resCipher);
// const resDecipher = jsDecrypt(resCipher);
// END ENCRYPTION AND DECRYPTION
// console.log(jsDecrypt("05010519040004190e02041a010e"))
module.exports = {
    encrypt,
    encryptSync,
    decrypt,
    decryptSync,
    createBcryptPswd,
    compareBcryptPswd,
    jsEncrypt,
    jsDecrypt,
}; // both returns string

// reference:
// https://vancelucas.com/blog/stronger-encryption-and-decryption-in-node-js/
// more: https://www.sohamkamani.com/nodejs/rsa-encryption/

/* ARCHIVES
https://stackoverflow.com/questions/18279141/javascript-string-encryption-and-decryption

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
