import lStorage, {
    setSystemOp,
    needAppRegisterOp,
} from "../../../utils/storage/lStorage";
import { getVar, setMultiVar, store } from "../../../hooks/storage/useVar";

export const handleRoleStorage = ({
    userScore,
    whichRole,
    bizId,
    memberId,
    memberJob,
    primaryAgent,
}) => {
    // n1
    const isBizTeam = whichRole === "nucleo-equipe";
    const isCliAdmin = whichRole === "cliente-admin";
    const isCliMember = whichRole === "cliente-membro";
    const isCliUser = whichRole === "cliente";

    // memberId: true is used to force registration.
    // if it is instant app, than it will have no affect

    let userPayload;

    if (isCliAdmin) {
        userPayload = [{ role: whichRole }];
    }

    if (isCliUser) {
        userPayload = [
            { role: whichRole },
            { lastRegisterBizId: bizId },
            { memberId },
            { memberRole: memberJob ? "cliente-membro" : "cliente-admin" },
            { memberJob: memberJob || "admin" },
            { userScore },
        ];
    }

    if (isCliMember) {
        userPayload = [
            { role: whichRole },
            { lastRegisterBizId: bizId },
            { memberJob: memberJob || "admin" },
            { memberId: true },
            { disconnectCliMember: true },
        ];
    }

    if (isBizTeam) {
        userPayload = [
            { role: whichRole },
            { primaryAgent },
            { memberId: true },
            { disconnectAgent: true },
        ];
    }

    (async () => {
        const isInstantAccount = await getVar("isInstantAccount", store.user);
        if (!isInstantAccount) {
            lStorage("setItem", { ...needAppRegisterOp, value: true });
        }

        await setMultiVar(userPayload, store.user);
        await setMultiVar(
            [
                { rememberAccess: false },
                { success: false },
                { verifPass: false },
            ],
            store.user
        );

        const needSysOp = whichRole && bizId;
        if (needSysOp) {
            lStorage("setItems", setSystemOp(whichRole, bizId));
        }

        // for garantee that the current app is logged out.
        // Otherwise, the app will be displayed with wrong and mingled app's pages.
        localStorage.removeItem("token");
    })();
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
