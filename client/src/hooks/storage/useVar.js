import { useEffect, useState } from "react";
import localforage from "localforage";

// LESSON: if not working correctly, check if store has already been declared.
const getObj = (name) => ({ storeName: name });
export const store = {
    offline_lists: getObj("offline_lists"),
    request_api_data: getObj("request_api_data"),
    once_checked: getObj("once_checked"),
    user: getObj("user"), // for profiles, offline profile data. useful to access the last user logged in data related.
    audios: getObj("audios"),
};

const variablesStore = (storeName = "global_variables") =>
    localforage.createInstance({
        name: `fiddelize-${storeName}`,
        storeName: storeName,
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
                    "Error with localForage white handling data: " + err
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

    const promises = arrayKeys.map((key) => {
        return variablesStore(storeName).getItem(key);
    });

    return await Promise.all(promises);
};

export const setVar = (obj, options = {}) => {
    const { storeName } = options;

    if (!obj) return;

    const [key] = Object.keys(obj);
    const [value] = Object.values(obj);

    return variablesStore(storeName)
        .setItem(key, value)
        .then((res) => null) // console.log(`key ${key} was set in local DB`)
        .catch((err) =>
            console.log(`the was an error setting key ${key}. Details: ${err}`)
        );
};

// objArray like [{ key1: value1 }, { key2: value2}]
export const setMultiVar = async (objArray, options = {}) => {
    const { storeName } = options;
    if (objArray && !objArray.length) return;

    const promises = objArray.map((obj) => {
        const [key] = Object.keys(obj);
        const [value] = Object.values(obj);

        return variablesStore(storeName)
            .setItem(key, value)
            .then((res) => null)
            .catch((err) =>
                console.log(
                    `the was an error setting key ${key}. Details: ${err}`
                )
            );
    });

    return await Promise.all(promises);
};

export const removeVar = (key, options = {}) => {
    const { storeName } = options;
    return variablesStore(storeName)
        .removeItem(key)
        .then((res) => console.log(`key ${key} removed from local DB`))
        .catch((err) =>
            console.log(`the was an error removing key ${key}. Details: ${err}`)
        );
};

function getStrVersion(str) {
    if (!str) return;
    const underscoreInd = str.indexOf("_");
    let version = str.slice(underscoreInd + 1);
    version = Number(version);

    return version;
}

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
