import { useEffect, useState } from 'react';
import localforage from 'localforage';
import { useStoreState } from 'easy-peasy';

const variablesStore = localforage.createInstance({ name: `fiddelize-global-variables` }) // n2
variablesStore.config({ storeName: "global_variables" }); // n3 dataStore

// using indexedDB with forage to store especially temporary variables.
// differently from localstorage which requires reloads to update the newest stored variables,
// indexedDB reads without the need of reloading...
let ignoreGetVar;
export default function useGetVar(key) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // if(!ignoreGetVar) return;
        if(!key) {
            setData(false);
            setLoading(false);
            return;
        }
        variablesStore.getItem(key)
        .then(fetchedValue => {
            setData(fetchedValue);
            setLoading(false);
            ignoreGetVar = true;
        })
        .catch(err => {
            console.log("Error with localForage white handling data: " + err);
            setLoading(false);
        })
        return () => { ignoreGetVar = true };
    }, [key])

    return { data, loading };
}

let ignore = false;
export const useOfflineListData = ({ listName, list, trigger, }) => {
    const [offlineList, setOfflineList] = useState(null);

    const { isOnline } = useStoreState(state => ({
        isOnline: state.authReducer.cases.isUserOnline,
    }));


    useEffect(() => {
        if(!listName) return;

        const gotItemsList = list && list.length;
        if(gotItemsList && isOnline && !ignore) {
            setVar({ [listName]: list })
            ignore = true;
        }
        if((!isOnline || trigger)) {
            getVar(listName)
            .then(offList => {
                setOfflineList(offList);
            })
        }

        return () => { ignore = true };

    }, [list, listName, isOnline, trigger])

    const hasListItems = offlineList && offlineList.length;
    return { isOffline: Boolean(!isOnline && hasListItems), offlineList };

}

export const getVar = (key) => {
    return variablesStore.getItem(key);
}

export const setVar = (obj) => {
    if(!obj) return;

    const [key] = Object.keys(obj);
    const [value] = Object.values(obj);

    return variablesStore.setItem(key, value)
    .then(res => console.log(`key ${key} was set in local DB`))
    .catch(err => console.log(`the was an error setting key ${key}. Details: ${err}`))
}
// can accept an key with object like: const obj = { key: { a: "123", b: true }}
// key
// { a: '123', b: true }

export const removeVar = (key) => {
    return variablesStore.removeItem(key)
    .then(res => console.log(`key ${key} removed from local DB`))
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

    return getVar(key)
    .then(storedVersion => {
        const currVersion = Number(value);
        if(currVersion >= Number(storedVersion)) {
            removeVar(key)
        }

    })
}