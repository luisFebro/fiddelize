import lStorage from './lStorage';
import areArraysEqual from '../arrays/areArraysEqual';
import isOffline from '../window/isOffline';
const isOnline = !isOffline();

export default function setDataIfOnline(options, ...dataOnline) {
    const valuesArray = [...dataOnline];

    if(isOnline) {
        const newObj = {...options, value: valuesArray}
        lStorage("setItems", newObj);
    }
}