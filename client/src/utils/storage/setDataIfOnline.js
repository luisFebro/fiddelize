import lStorage from './lStorage';
// import areArraysEqual from '../arrays/areArraysEqual';
import isOffline from '../window/isOffline';
const isOnline = !isOffline();

export default function setDataIfOnline(options, dataOnline) {
    const isArray = Array.isArray(dataOnline);
    const isObj = !isArray && typeof dataOnline === 'object';

    if(isOnline) { // Future updates, maybe we should compare arrays, if they are diff, then apply new values...
        if(isArray) {
            const newObj = {...options, value: dataOnline}
            lStorage("setItemsByArray", newObj);
        }
        if(isObj) {
            const newObj = {...options, newObj: dataOnline}
            lStorage("setItems", newObj);
        }
    }
}