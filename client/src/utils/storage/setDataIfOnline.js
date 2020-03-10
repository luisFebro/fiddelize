import lStorage from './lStorage';
// import areArraysEqual from '../arrays/areArraysEqual';
import isOffline from '../window/isOffline';
const isOnline = !isOffline();

export default function setDataIfOnline(options, ...dataOnline) {
    const valuesArray = [...dataOnline];

    if(isOnline) { // Future updates, maybe we should compare arrays, if they are diff, then apply new values...
        const newObj = {...options, value: valuesArray}
        lStorage("setItems", newObj);
    }
}