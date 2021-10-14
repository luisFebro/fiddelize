import { removeVars } from "init/var";
// remove all data after user click in finish in points panel or when coming from the app bottom  or pts card notif

export default async function resetAddPtsData() {
    return await removeVars(["ptsId", "currPoints", "paidValue", "staff"]);
}
