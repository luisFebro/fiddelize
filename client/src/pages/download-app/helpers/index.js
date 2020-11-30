import lStorage, {
    setSystemOp,
    needAppRegisterOp,
} from "../../../utils/storage/lStorage";
import { setMultiVar, store } from "../../../hooks/storage/useVar";

export const handleRoleStorage = ({ whichRole, bizId, registeredBy }) => {
    // n1
    setMultiVar([{ role: whichRole }, { registeredBy }], store.user);
    lStorage("setItems", setSystemOp(whichRole, bizId));
    lStorage("setItem", { ...needAppRegisterOp, value: true });

    console.log("role storate set");
};

/* COMMENTS
n1: LESSON: lStorage does not work with useEffect. just declare in the function body normally...
If you see an error in JSON position, also check local storage for missing comma while editing...
*/

/* ARCHIVES
const appSystem = lStorage("getItems", { collection: "appSystem" });

const isAdminLoggedIn = // ?
        appSystem && appSystem.roleWhichDownloaded === "cliente-admin";

 */
