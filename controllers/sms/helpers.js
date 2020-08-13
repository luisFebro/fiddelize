const convertPhoneStrToInt = require('../../utils/number/convertPhoneStrToInt');

// HELPERS
function getContactDetails(contactList) {
    let finalStr = "";

    contactList.map((data, ind) => {
        const n = ind + 1;
        const client = data.name;
        const finalPhoneNumber = convertPhoneStrToInt(data.phone);

        finalStr += `&refer${n}=${client}&number${n}=${finalPhoneNumber}`;
    })

    return finalStr;
}
// END HELPERS

// REQUEST IN BATCHES n2
const setCustomConfig = ({
    contactsStr, msg, secret, serviceType, jobdateQuery, jobtimeQuery, flashQuery
}) => ({
    "method": "GET",
    "hostname": "api.smsdev.com.br",
    "port": null,
    "path": encodeURI(`/multiple?key=${secret}&type=${serviceType}${contactsStr}&msg=${msg}${jobdateQuery}${jobtimeQuery}${flashQuery}`),
    "headers": {}
})

async function requestInBatch(data, options = {}) {
    const { batchSize = 300, promise, moreConfig } = options;

    const dataLength = data.length

    let i = 0;
    let batchCount = 0;
    for (; i < dataLength; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        const contactsStr = getContactDetails(batch);

        const requestBatch = async () => {
            return await promise(setCustomConfig({ contactsStr, ...moreConfig }))
           .catch(e => console.log(`Error in requesting the following ${each} - ${e}`)) // Catch the error if something goes wrong. So that it won't block the loop.
        }

        // Promise.all will wait till all the promises got resolves and then take the next batch.
        return await Promise.all([requestBatch()])
        .then(data => {
            console.log(`batch N° ${++batchCount} OK.`)
            return data;
        })
        .catch(e => console.log(`Error in requesting the batch N.° ${i + 1} - ${e}`)) // Catch the error.
    }
}
// END REQUEST IN BATCHES

module.exports = {
    getContactDetails,
    setCustomConfig,
    requestInBatch,
};