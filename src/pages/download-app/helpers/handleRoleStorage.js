import { setVars } from "init/var";
import { setItems } from "init/lStorage";

export default function handleRoleStorage({
    userScore,
    whichRole,
    bizId,
    memberId,
    memberJob,
    primaryAgent,
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
            role: whichRole,
            lastRegisterBizId: bizId,
            memberId,
            memberRole: memberJob ? "cliente-membro" : "cliente-admin",
            memberJob: memberJob || "admin",
            userScore,
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
        await setVars(userPayload, "user");
        await setVars(
            {
                rememberAccess: false,
                success: false,
                verifPass: false,
                needAppRegister: true,
            },
            "user"
        );

        const needSysOp = whichRole && bizId;
        if (needSysOp)
            setItems("appSystem", {
                roleWhichDownloaded: whichRole,
                businessId: bizId,
            });

        // for garantee that the current app is logged out.
        // Otherwise, the app will be displayed with wrong and mingled app's pages.
        localStorage.removeItem("token");
    })();
}
