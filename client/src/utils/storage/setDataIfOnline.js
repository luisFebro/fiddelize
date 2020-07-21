import lStorage, {
    userProfileColl, clientAdminColl, setInitialStateOp, centralAdminColl } from './lStorage';
import { useStoreState } from 'easy-peasy';

// options argument should be depracated after changing setItemsByArray for setItems (obj)
export default function setDataIfOnline(collectionData, dataOnline, isUserOnline) {
    const isArray = Array.isArray(dataOnline);
    const isObj = !isArray && typeof dataOnline === 'object';
    if(!isObj) throw new Error("You should send as the second argument an object with keys to be inserted in the local storage.")

    // this data is set only with there is no essential info in local storage.
    if(!lStorage("getItem", setInitialStateOp)) {
        lStorage("setItems", userProfileColl);
        lStorage("setItems", clientAdminColl);
        lStorage("setItems", centralAdminColl);

        lStorage("setItem", { ...setInitialStateOp, value: true })
    }

    // isUserOnline checks if online fetch with db on loadUser, login or register succeed.
    const areCollectionsEqual = lStorage("compareCol", {...collectionData, compareThisObj: dataOnline });
    const isUserOnlineAndDataChanged = isUserOnline && !areCollectionsEqual;
    if(isUserOnlineAndDataChanged) {
        // console.log("Setting data to lStorage at setDAtaIfOnline");
        const newOptions = {...collectionData, newObj: dataOnline}
        // console.log("newOptions", newOptions);
        lStorage("setItems", newOptions);
    }
}