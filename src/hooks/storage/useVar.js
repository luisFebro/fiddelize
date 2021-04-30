import { useEffect, useState } from "react";
import localforage from "localforage";
import isObj from "utils/isObj";

// LESSON: if not working correctly, check if store has already been declared.
const getObj = (name) => ({ storeName: name });
export const store = {
    offline_lists: getObj("offline_lists"),
    request_api_data: getObj("request_api_data"),
    once_checked: getObj("once_checked"),
    pre_register: getObj("pre_register"),
    user: getObj("user"), // for profiles, offline profile data. useful to access the last user logged in data related.
    audios: getObj("audios"),
};

const variablesStore = (storeName = "global_variables") =>
    localforage.createInstance({
        name: `fiddelize-${storeName}`,
        storeName,
    });

// using indexedDB with forage to store especially temporary variables.
// differently from localstorage which requires reloads to update the newest stored variables,
// indexedDB reads without the need of reloading...
let ignoreGetVar;
export default function useGetVar(key, options = {}) {
    const { storeName } = options;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // if(!ignoreGetVar) return;
        if (!key) {
            setData(false);
            setLoading(false);
            return;
        }
        variablesStore(storeName)
            .getItem(key)
            .then((fetchedValue) => {
                setData(fetchedValue);
                setLoading(false);
                ignoreGetVar = true;
            })
            .catch((err) => {
                console.log(
                    `Error with localForage white handling data: ${err}`
                );
                setLoading(false);
            });
        return () => {
            ignoreGetVar = true;
        };
    }, [key]);

    return { data, loading };
}

export const getVar = (key, options = {}) => {
    const { storeName } = options;
    return variablesStore(storeName).getItem(key);
};

export const getMultiVar = async (arrayKeys, options = {}) => {
    const { storeName } = options;

    const promises = arrayKeys.map((key) =>
        variablesStore(storeName).getItem(key)
    );

    return await Promise.all(promises);
};

export const setVar = (obj, options = {}) => {
    const { storeName } = options;

    if (!obj) return;

    const [key] = Object.keys(obj);
    const [value] = Object.values(obj);

    return variablesStore(storeName)
        .setItem(key, value)
        .catch((err) =>
            console.log(`the was an error setting key ${key}. Details: ${err}`)
        );
};

// dataObj like { key1: value1, key2: value2 }
export const setMultiVar = async (dataObj, options = {}) => {
    const { storeName } = options;
    if (!isObj(dataObj, { noArrays: true }))
        throw new Error("only object is allowed");
    if (!dataObj) return null;

    const promises = [];
    // https://stackoverflow.com/questions/43807515/eslint-doesnt-allow-for-in
    Object.keys(dataObj).forEach((key) => {
        const value = dataObj[key];
        if (!value) promises.push(null);

        promises.push(
            variablesStore(storeName)
                .setItem(key, value)
                .catch((err) =>
                    console.log(
                        `the was an error setting key ${key}. Details: ${err}`
                    )
                )
        );
    });

    await Promise.all(promises);
    return `all variables in ${storeName}'s store was set`;
};

export const removeVar = async (key, options = {}) => {
    const { storeName } = options;
    return variablesStore(storeName)
        .removeItem(key)
        .then((res) => console.log(`key ${key} removed from local DB`))
        .catch((err) =>
            console.log(`the was an error removing key ${key}. Details: ${err}`)
        );
};

// e.g ["elem1", "elem2"]
export const removeMultiVar = async (strArray, options = {}) => {
    const { storeName } = options;
    if (strArray && !strArray.length) return;

    const promises = strArray.map((strElem) =>
        variablesStore(storeName)
            .removeItem(strElem)
            .then((res) => null)
            .catch((err) =>
                console.log(
                    `the was an error removing key ${strElem}. Details: ${err}`
                )
            )
    );

    return await Promise.all(promises);
};

export const removeCollection = async (storeName) =>
    await localforage.dropInstance({
        name: `fiddelize-${storeName}`,
        // storeName: storeName, // if this is specified, only the store inside collection is removed.
    });

// handle the variable version to be removed - challenge_1 - always insert _1 to get the version.
export const removeVersion = ({ key, value }) => {
    if (!key || !value) return;

    return getVar(key).then((storedVersion) => {
        const currVersion = Number(value);
        if (currVersion >= Number(storedVersion)) {
            removeVar(key);
        }
    });
};
