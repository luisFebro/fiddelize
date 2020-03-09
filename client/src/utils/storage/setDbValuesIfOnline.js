import lStorage from './lStorage';
const isOffline = false; // this should be a separate working function...
const isOnline = !isOffline;

export default function setDbValuesIfOnline(currColl, valuesArray) {
    if(isOnline) {
        const newObj = {...currColl, value: valuesArray}
        lStorage("setItems", newObj);
    }
}