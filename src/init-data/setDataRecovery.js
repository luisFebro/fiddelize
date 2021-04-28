import { getMultiVar, store } from "hooks/storage/useVar";
import isOffline from "utils/server/isOffline";
import { useProfile, useClientAdmin, useClientUser } from "hooks/useRoleData";
import lStorage, {
    userProfileColl,
    clientAdminColl,
    setInitialStateOp,
} from "../utils/storage/lStorage";

console.log("userProfileColl", userProfileColl);
console.log("clientAdminColl", clientAdminColl);
console.log("setInitialStateOp", setInitialStateOp);

const userData = lStorage("getItems", userProfileColl); // n1
console.log("userData", userData);
const clientAdminData = lStorage("getItems", clientAdminColl);
console.log("clientAdminData", clientAdminData);

const appSystem = lStorage("getItems", { collection: "appSystem" });
const localstorageBizId = appSystem && appSystem.businessId;
const isUserOnline = !isOffline();

export default async function setDataRecovery() {
    const [indexedBizId, role, userId] = await getMultiVar(
        ["bizId", "role", "userId"],
        store.user
    );

    const bizId = localstorageBizId || indexedBizId;
    console.log("bizId", bizId);
    console.log("role", role);
    console.log("userId", userId);

    // const clientUserValues = useClientUser();
    // const profileValues = useProfile();

    // // data
    // const clientAdminNewObj = useClientAdmin();
    // const userProfileNewObj = { ...profileValues, ...clientUserValues };

    setDataIfOnline(userProfileColl, {}); // userProfileNewObj
    setDataIfOnline(clientAdminColl, {}); // clientAdminNewObj
}

// options argument should be depracated after changing setItemsByArray for setItems (obj)
function setDataIfOnline(priorDataCollection, dataOnline) {
    const alreadySetDataInLocalstorage = lStorage("getItem", setInitialStateOp);
    if (!alreadySetDataInLocalstorage) {
        lStorage("setItems", userProfileColl);
        lStorage("setItems", clientAdminColl);

        lStorage("setItem", { ...setInitialStateOp, value: true });
    }

    // isUserOnline checks if online fetch with db on loadUser, login or register succeed.
    const areCollectionsEqual = lStorage("compareCol", {
        ...priorDataCollection,
        compareThisObj: dataOnline,
    });
    const isUserOnlineAndDataChanged = isUserOnline && !areCollectionsEqual;
    if (!isUserOnlineAndDataChanged) return;

    // console.log("Setting data to lStorage at setDAtaIfOnline");
    const newOptions = { ...priorDataCollection, newObj: dataOnline };
    // console.log("newOptions", newOptions);
    lStorage("setItems", newOptions);
}

/* ARCHIVES

const isArray = Array.isArray(dataOnline);
const isObj = !isArray && typeof dataOnline === "object";
if (!isObj)
    throw new Error(
        "You should send as the second argument an object with keys to be inserted in the local storage."
    );

*/
