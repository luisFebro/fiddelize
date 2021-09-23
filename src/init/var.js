import { useEffect, useState } from "react";
import localforage from "localforage";
import isObj from "utils/isObj";

const allowedStores = [
    "global_vars",
    "user",
    "audios",
    "offline_lists",
    "request_api_data",
    "once_checked",
    "pre_register",
];

const variablesStore = (storeName = "global_vars") =>
    localforage.createInstance({
        name: `fiddelize-${storeName}`,
        storeName,
    });

export default function getVar(key, options = {}) {
    const storeName = handleStoreName(options);

    return variablesStore(storeName).getItem(key);
}

// for user's data, prefer using useData like const [staffJob, loadingStaff] = useData(["memberJob"], { dots: false });
export const useVar = (key, options = {}) => {
    const { dots = false, store } = options;

    const [val, setVal] = useState(dots ? "..." : null);

    useEffect(() => {
        getVar(key, store).then((value) => setVal(value));
    }, [key]);

    return val;
};

export const setVar = (obj, options) => {
    const storeName = handleStoreName(options);

    if (!obj) return null;

    const [key] = Object.keys(obj);
    const [value] = Object.values(obj);

    return variablesStore(storeName)
        .setItem(key, value)
        .catch((err) =>
            console.log(`the was an error setting key ${key}. Details: ${err}`)
        );
};

export const removeVar = async (key, options = {}) => {
    const storeName = handleStoreName(options);

    return variablesStore(storeName)
        .removeItem(key)
        .then(console.log(`key ${key} removed from local DB`))
        .catch((err) =>
            console.log(`the was an error removing key ${key}. Details: ${err}`)
        );
};

export const getVars = async (arrayKeys, options) => {
    const storeName = handleStoreName(options);

    const promises = arrayKeys.map((key) =>
        variablesStore(storeName).getItem(key)
    );

    return await Promise.all(promises);
};

// dataObj like { key1: value1, key2: value2 }
export const setVars = async (dataObj, options = {}) => {
    const storeName = handleStoreName(options);

    if (!isObj(dataObj, { noArrays: true }))
        throw new Error("only object is allowed");
    if (!dataObj) return null;

    const promises = [];
    // https://stackoverflow.com/questions/43807515/eslint-doesnt-allow-for-in
    Object.keys(dataObj).forEach((key) => {
        const value = dataObj[key];
        if (value === undefined || value === null) {
            promises.push(null);
            return;
        }

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

    return await Promise.all(promises);
};

// e.g ["elem1", "elem2"]
export const removeVars = async (strArray, options = {}) => {
    const storeName = handleStoreName(options);

    if (strArray && !strArray.length) return null;

    const promises = strArray.map((strElem) =>
        variablesStore(storeName)
            .removeItem(strElem)
            .catch((err) =>
                console.log(
                    `the was an error removing key ${strElem}. Details: ${err}`
                )
            )
    );

    return await Promise.all(promises);
};

export const removeStore = async (store) => {
    const storeName = handleStoreName(store);

    return await localforage.dropInstance({
        name: `fiddelize-${storeName}`,
        // storeName: storeName, // if this is specified, only the store inside collection is removed.
    });
};

// HELPERS
// allow passing name of store as the second string argument directly.
function handleStoreName(data) {
    let storeName = data; // allow passing name of store as the second argument directly.
    if (typeof data === "object") storeName = data.storeName;
    if (!allowedStores.includes(storeName) && storeName !== undefined)
        Promise.reject(
            `the store ${storeName.toUpperCase()} is not allowed. Only: ${allowedStores}`
        );

    return storeName;
}
// END HELPERS
