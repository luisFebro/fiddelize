import { removeItems } from "init/lStorage";
import { setVars } from "init/var";

export default function handleRoleStorage({
    encryptedPTS,
    whichRole,
    bizId,
    bizName,
    memberId,
    memberJob,
    memberName,
    primaryAgent,
    linkCode,
    bizLinkName,
}) {
    const isBizTeam = whichRole === "nucleo-equipe";
    const isCliAdmin = whichRole === "cliente-admin";
    const isCliMember = whichRole === "cliente-membro";
    const isCliUser = whichRole === "cliente";

    let userPayload;

    if (isCliAdmin) {
        userPayload = { role: whichRole };
    }

    if (isCliUser) {
        userPayload = {
            bizName, // for download app guide
            role: whichRole,
            lastRegisterBizId: bizId,
            memberId,
            memberName,
            memberRole: memberJob ? "cliente-membro" : "cliente-admin",
            memberJob: memberJob || "admin",
            encryptedPTS,
            linkCode,
            bizLinkName,
        };
    }

    if (isCliMember) {
        userPayload = {
            disconnectCliMember: true,
            role: whichRole,
            lastRegisterBizId: bizId,
            memberJob: memberJob || "admin",
        };
    }

    if (isBizTeam) {
        userPayload = {
            disconnectAgent: true,
            role: whichRole,
            primaryAgent,
        };
    }

    (async () => {
        await setVars(
            {
                ...userPayload,
                rememberAccess: false,
                success: false,
                token: false,
                needAppRegister: !isCliAdmin, // cli-admin has already registered in the app creation flow and thus only requires direct access to login
            },
            "user"
        );

        // for garantee that the current app is logged out.
        // Otherwise, the app will be displayed with wrong and mingled app's pages.
        removeItems("currUser", ["token"]);
    })();
}
