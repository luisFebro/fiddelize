const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // insert it here cuz env variables server is not reaching utils

const KRYPTO_SECRET = process.env.KRYPTO_SECRET; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16
const JWT_SECRET = process.env.JWT_SECRET;

// JWT AUTHORIZATION, SESSION, EXPIRY TOKENS
// There is also jwt.decode...
async function createJWT(data, options = {}) {
    const { secret, expiry = "24h" } = options;

    const thisSecret = secret || JWT_SECRET;
    const payload = typeof data === "string" ? { id: data } : data; // payload is used when external data's obj is required like account's preLogin.
    return await jwt.sign(payload, thisSecret, {
        expiresIn: expiry,
    });
}

// handle error like: await checkJWT(token).catch(e => res.status(400).json({ error: "Este link já expirou." }))
// if secret (signature) is invalid. This error is thrown: JsonWebTokenError: invalid signature
// return this decoded obj = { "id": "5e8b0bfc8c616719b01abc9c", "iat": 1603553211, "exp": 1603553811 }
async function checkJWT(token, options = {}) {
    const { secret } = options;
    const thisSecret = secret || JWT_SECRET;

    return await jwt.verify(token, thisSecret);
}
// END JWT AUTHORIZATION, SESSION, EXPIRY TOKENS

// HASHING ENCRYPTION - BCRYPT FOR DB PASSWORDS
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

// HASHING ENCRYPTION - END BCRYPT FOR DB PASSWORDS

// AES ENCRYPTION AND DECRYPTION
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
// AES ENCRYPTION AND DECRYPTION

// JS ENCRYPTION AND DECRYPTION
// less secure for authentication which requires decryption.
// but can be useful to obscurate data in http requests, better than in plain text, right?
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

// END JS ENCRYPTION AND DECRYPTION

// TEST
// const resCipher = jsEncrypt('111.111.111-00');
// console.log("resCipher", resCipher);
// const resDecipher = jsDecrypt(resCipher);
// END ENCRYPTION AND DECRYPTION
console.log(jsDecrypt("02030719020e0f1903030f1a0204"));
// console.log(encryptSync("mr.febro@gmail.com"));
//console.log(decryptSync("b6796df19acd8d308b6b6ca9a7db83a6:5933bc3e35116a1597aef36878f89ea0"));
// (async () => {
//     const res = await createBcryptPswd("940823")
//     console.log("res", res);
// })()
module.exports = {
    encrypt,
    encryptSync,
    decrypt,
    decryptSync,
    createBcryptPswd,
    compareBcryptPswd,
    jsEncrypt,
    jsDecrypt,
    createJWT,
    checkJWT,
}; // both returns string

// reference:
// https://vancelucas.com/blog/stronger-encryption-and-decryption-in-node-js/
// more: https://www.sohamkamani.com/nodejs/rsa-encryption/

/* COMMENTS
n1: add cipher (myCpf + 1) add + 1 at hte very end of decipher krypto_secret and faces will be displayed.
*/
