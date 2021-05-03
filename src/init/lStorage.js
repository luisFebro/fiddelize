import isObj from "utils/isObj";
// only for crucial and essencial variables which requires a bootup value right away like background color and important user's data. The performance can be an issue if localstorage is huge in size since is syncronous.
// all secondary data should use indexedDB.

const allowedCollections = ["currUser", "bizData", "appSystem", "onceChecked"];

function setItems(collectionName, dataObj) {
    if (!allowedCollections.includes(collectionName))
        throw new Error(
            `the collection ${collectionName.toUpperCase()} is not allowed. Only: ${allowedCollections}`
        );
    if (!isObj(dataObj, { noArrays: true }))
        throw new Error("only object is allowed");
    if (!collectionName)
        throw new Error("missing collection name as the first argument");
    if (!dataObj)
        throw new Error(
            "new obj should has new data to be stored in localstorage with props and values. e.g { name: `john` }"
        );

    const priorData = getCurrCollectionData(collectionName);

    const result = { ...priorData, ...dataObj };

    return localStorage.setItem(collectionName, JSON.stringify(result));
}

function getItems(collectionName, namesArray = null) {
    if (!allowedCollections.includes(collectionName))
        throw new Error(
            `the collection ${collectionName.toUpperCase()} is not allowed. Only: ${allowedCollections}`
        );
    if (!collectionName)
        throw new Error("missing collection name as the first argument");
    if (!Array.isArray(namesArray) && namesArray !== null)
        throw new Error("Requires an array data format");

    const currData = getCurrCollectionData(collectionName);
    if (!currData) return [null];
    if (namesArray === null) return [currData];

    const finalDataResult = [];
    namesArray.forEach((key) => {
        if (!currData[key]) finalDataResult.push(null);
        finalDataResult.push(currData[key]);
    });

    return finalDataResult;
}

function removeItems(collectionName, namesArray) {
    if (!allowedCollections.includes(collectionName))
        throw new Error(
            `the collection ${collectionName.toUpperCase()} is not allowed. Only: ${allowedCollections}`
        );
    if (!collectionName)
        throw new Error("missing collection name as the first argument");
    if (!Array.isArray(namesArray))
        throw new Error("Requires an array data format");

    const currData = getCurrCollectionData(collectionName);
    if (!currData) throw new Error(`Not possible to remove item(s)`);

    namesArray.forEach((key) => {
        if (!currData[key])
            throw new Error(
                `the key ${key.toUpperCase()} is not available in the ${collectionName.toUpperCase()}'s collection`
            );
        delete currData[key];
    });

    if ("localStorage" in window)
        return localStorage.setItem(collectionName, JSON.stringify(currData));
    throw new Error("localstorage not available");
}

function removeCollection(collectionName) {
    if (!allowedCollections.includes(collectionName))
        throw new Error(
            `the collection ${collectionName.toUpperCase()} is not allowed. Only: ${allowedCollections}`
        );
    if (!collectionName)
        throw new Error("missing collection name as the first argument");

    const collectionData = getCurrCollectionData(collectionName);
    const isValidCollection = Boolean(collectionData);
    if (!isValidCollection)
        console.log(
            `ERROR: the collection ${collectionName.toUpperCase()} does not exist or already removed`
        );

    if ("localStorage" in window) {
        localStorage.removeItem(collectionName);
    }
    return null;
}

// HELPERS
function getCurrCollectionData(collectionName) {
    if ("localStorage" in window) {
        return JSON.parse(localStorage.getItem(collectionName));
    }

    return {};
}
// END HELPERS

export { setItems, getItems, removeItems, removeCollection };
