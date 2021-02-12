import { encrypt, decrypt } from "./xCipherFront";

async function encryptCreditCard(data = {}) {
    const {
        cardHolder,
        cardNumber,
        expirationYear,
        expirationMonth,
        cvv,
    } = data;

    const run = (resolve, reject) => {
        const encryptedObj = encrypt(data, { isObj: true });
        resolve(encryptedObj);
    };

    return new Promise(run);
}

async function decryptCreditCard(code) {
    const run = (resolve, reject) => {
        if (!code) reject({ error: "the encrypted code is required." });
        resolve(decrypt(code, { isObj: true }));
    };

    return new Promise(run);
}

export { encryptCreditCard, decryptCreditCard };

// Examples
// (async () => {
//     const cardData = {
//         cardNumber: "4111222233334444",
//         expirationYear: "2030",
//         expirationMonth: "10",
//         cvv: "123",
//         cardHolder: "Luis Felipe Bruno"
//     }
//     const resEncrypt = await encryptCreditCard(cardData)
//         .catch(err => { console.log(err); });
//     if(!resEncrypt) return;
//     console.log("resEncrypt", resEncrypt); // U2FsdGVkX183K1MSGNCWPvmpOVwnEAPSHCRFH0Vx11xi0hbGaER7N2zTst/yS6dcbtEHR8TGyxy7OyKbLN4HPQdBEMDCaIqkyl9vLo53CIY=.::U2FsdGVkX191GgNulHGie/iToIBJOun20u4qcklHnGXImFhUt2i2bz/2Tn/DQNMV
// })()

// (async () => {
//     const code = "U2FsdGVkX1+RemkYkqNLNtyi5FJlYybhnhR6KsCwtgpJZ9f0k3wVq2iMbZumSBLUSvAW+wVIVQ2PubczLwXZujEotT0SfDG8gwauBsIw3DptmwIEQKHBrvq30yIR1DZ37h1bDb8WZX8fCQ2X/S0NeGjSVYXyYd95Fyb3b4vvWRCugnu2lsWCHkA3muGjxez4WiffgQw5UC5YTfhhPaoIow==";
//     const resDecrypt = await decryptCreditCard(code)
//         .catch(e => { console.log(e) });
//     if(!resDecrypt) return;
//     console.log("resDecrypt", resDecrypt);
// })()

// ARCHIVES
/* My prior solution was slower because I encrypted twice and then an average of 3.5 comparing to crypto-js 1 second

// RC = random character
// (x) regression by quantity of random characters starting by 8 decreasing between each info.
// RC(8)cvvRC(7)expirationYearRC(6)cardNumberRC(5)expirationMonthRC(4).::cardHolder

async function encryptCreditCard(options = {}) {
    const {
        cardHolder,
        cardNumber,
        expirationYear,
        expirationMonth,
        cvv,
    } = options;

    const dataIndex = {
        4: cvv,
        3: expirationYear,
        2: `${cardNumber}:`, // : used to detect the end of number which can be volatile
        1: expirationMonth,
    }

    const run = (resolve, reject) => {
        if(!cardHolder || !cardNumber || !expirationYear || !expirationMonth || !cvv) {
            reject({ error: "Missing one of these demantory params: cardHolder, cardNumber, valYear/Month or cvv"})
        }

        let charactersQuantity = 8;
        let totalInfo = 4;
        let preEncoded = "";
        while(totalInfo) {
            preEncoded += `${generateAlphaNumeric(charactersQuantity)}${dataIndex[totalInfo]}`;
            --totalInfo;
            --charactersQuantity;
        }

        const preEncodedReady = encrypt(`${preEncoded}${generateAlphaNumeric(4)}`);
        resolve(`${preEncodedReady}.::${encrypt(cardHolder)}`)
    }

    return new Promise(run);
}

async function decryptCreditCard(code) {

    const run = (resolve, reject) => {
        if(!code) reject({ error: "the encrypted code is required." })
        const [mainCode, cardHolderEncoded] = code.split(".::")
        const preDecoded = decrypt(mainCode);
        const cardHolder = decrypt(cardHolderEncoded);

        const CVV_SIZE = 3;
        const cvvArea = preDecoded.slice(0, 11);
        const cvv = cvvArea.slice(-CVV_SIZE);
        const cvvInd = preDecoded.indexOf(cvv);

        const EXPIRATION_YEAR_SIZE = 4;
        const expirationYearArea = preDecoded.slice(cvvInd + CVV_SIZE, 22)
        const expirationYear = expirationYearArea.slice(-EXPIRATION_YEAR_SIZE);
        const expirationYearInd = preDecoded.indexOf(expirationYear);

        const cardNumberArea = preDecoded.slice(expirationYearInd + EXPIRATION_YEAR_SIZE, 48)
        let [cardNumber, ] = cardNumberArea.split(":");
        cardNumber = cardNumber.slice(6);

        const expirationMonth = preDecoded.slice(-6).slice(0, 2);

        resolve({
            cardHolder,
            cardNumber,
            expirationMonth,
            expirationYear,
            cvv,
        })
    }

    return new Promise(run);
}
 */
