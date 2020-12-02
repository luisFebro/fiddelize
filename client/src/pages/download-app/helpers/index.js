import lStorage, {
    setSystemOp,
    needAppRegisterOp,
} from "../../../utils/storage/lStorage";
import { setMultiVar, store } from "../../../hooks/storage/useVar";

export const handleRoleStorage = ({
    userScore,
    whichRole,
    bizId,
    memberId,
    memberJob,
}) => {
    // n1
    const isCliUser = whichRole === "cliente";
    let userPayload;

    if (isCliUser) {
        userPayload = [
            { lastRegisterBizId: bizId },
            { memberId },
            { memberRole: memberJob ? "cliente-membro" : "cliente-admin" },
            { memberJob: memberJob ? memberJob : "admin" },
            { role: whichRole },
            { userScore },
        ];
    } else {
        userPayload = [{ lastRegisterBizId: bizId }, { role: whichRole }];
    }

    setMultiVar(userPayload, store.user);
    lStorage("setItems", setSystemOp(whichRole, bizId));
    lStorage("setItem", { ...needAppRegisterOp, value: true });
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
