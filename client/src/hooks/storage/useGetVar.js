import { useEffect, useState } from 'react';
import localforage from 'localforage';

// using indexedDB with forage to store especially temporary variables.
// differently from localstorage which requires reloads to update the newest stored variables,
// indexedDB reads without the need of reloading...
export default function useGetVar(key) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!key) {
            setData(false);
            setLoading(false);
            return;
        }
        let ignore;
        variablesStore.getItem(key)
        .then(fetchedValue => {
            !ignore && setData(fetchedValue);
            setLoading(false);
            ignore = true;
        })
        .catch(err => {
            console.log("Error with localForage white handling data: " + err);
            setLoading(false);
        })
        return () => { ignore = true };
    }, [key])

    return { data, loading };
}

const variablesStore = localforage.createInstance({ name: `fiddelize-global-variables` }) // n2
variablesStore.config({ storeName: "global_variables" }); // n3 dataStore

export const getVar = (key) => {
    return variablesStore.getItem(key);
}

export const setVar = (obj) => {
    if(!obj) return;

    const [key] = Object.keys(obj);
    const [value] = Object.values(obj);

    variablesStore.setItem(key, value)
    .then(res => console.log(`key ${key} was set in the indexedDB variables`))
    .catch(err => console.log(`the was an error setting key ${key}. Details: ${err}`))
}
// can accept an key with object like: const obj = { key: { a: "123", b: true }}
// key
// { a: '123', b: true }

export const removeVar = (key) => {
    variablesStore.removeItem(key)
    .then(res => console.log(`key ${key} removed from indexedDB`))
    .catch(err => console.log(`the was an error removing key ${key}. Details: ${err}`))
}

function getStrVersion(str) {
    if(!str) return;
    const underscoreInd = str.indexOf("_");
    let version = str.slice(underscoreInd + 1);
    version = Number(version);

    return version;
}

// handle the variable version to be removed - challenge_1 - always insert _1 to get the version.
export const removeVersion = ({ key, value }) => {
    if(!key || !value) return;

    getVar(key)
    .then(storedVersion => {
        const currVersion = Number(value);
        if(currVersion > Number(storedVersion)) {
            removeVar(key)
        }

    })
}