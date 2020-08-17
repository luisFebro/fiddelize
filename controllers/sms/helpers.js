// REQUEST IN BATCHES
async function requestMultiBatch(data, options = {}) {
    const {
        promise,
        moreConfig,
        getUrl,
        prop = "id",
    } = options;

    const requestBatch = async (elem) => {
        const path = getUrl(elem[prop]);
        return await promise({ ...moreConfig, ...path })
       .catch(e => console.log(`Error in requesting specific batch: - ${e}`))
    }

    return await Promise.all(data.map(elem => requestBatch(elem)))
    .then(data => data)
    .catch(e => console.log(`Error in requesting one of the batches: ${e}`))
}
// END REQUEST IN BATCHES

const handleSmsStatus = (status) => {
    switch(status) {
        case "RECEBIDA":
        case "ENVIADA":
            return "VISTO ✔";
        case "FILA":
            return "agendado";
        case "ERRO":
        case "BLACK LIST":
            return "falhou";
        case "CANCELADA":
            return "cancelado";
        default:
            return "falhou";
    }
}

module.exports = {
    requestMultiBatch,
    handleSmsStatus,
};

/* ARCHIVES
async function requestInBatch(data = [], options = {}) {
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
*/