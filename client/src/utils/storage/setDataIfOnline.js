import lStorage, { userProfileOp, clientAdminOp, setInitialStateOp } from './lStorage';
import isOffline from '../window/isOffline';
import { useStoreState } from 'easy-peasy';

export default function setDataIfOnline(options, dataOnline, isUserOnline) {
    const isArray = Array.isArray(dataOnline);
    const isObj = !isArray && typeof dataOnline === 'object';
    if(!isObj) throw new Error("You should send as the second argument an object with keys to be inserted in the local storage.")

    // this data is set only with there is no essential info in local storage.
    if(!lStorage("getItem", setInitialStateOp)) {
        lStorage("setItemsByArray", userProfileOp);
        lStorage("setItemsByArray", clientAdminOp);
        lStorage("setItem", { ...setInitialStateOp, value: true })
    }

    // isUserOnline checks if online fetch with db on loadUser, login or register succeed.
    const areCollectionsEqual = lStorage("compareCol", {...options, compareThisObj: dataOnline });
    const isUserOnlineAndDataChanged = isUserOnline && !areCollectionsEqual;
    if(isUserOnlineAndDataChanged) {
        console.log("Setting data to lStorage");
        console.log("isUserOnline", isUserOnline);
        console.log("areCollectionsEqual", areCollectionsEqual);
        const newOptions = {...options, newObj: dataOnline}
        lStorage("setItems", newOptions);
    }
}