import lStorage from './lStorage';
// import areArraysEqual from '../arrays/areArraysEqual';
import isOffline from '../window/isOffline';
const isOnline = !isOffline();

export default function setDataIfOnline(options, dataOnline) {
    const isArray = Array.isArray(dataOnline);
    const isObj = !isArray && typeof dataOnline === 'object';
    if(!isObj) throw new Error("You should send as the second argument an object with keys to be inserted in the local storage.")

    if(isOnline) { // Future updates, maybe we should compare arrays, if they are diff, then apply new values...
        const newOptions = {...options, newObj: dataOnline}
        lStorage("setItems", newOptions);
    }
}