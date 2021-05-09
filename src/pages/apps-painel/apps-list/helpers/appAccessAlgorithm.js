import { removeVar, setVar, removeVars } from "init/var";
import getItems, { removeItems } from "init/lStorage";
import renewToken from "auth/renewToken";
import { signInUserData } from "components/auth/Login";
import getAPI, { setDefaultAccess } from "api";
import { setRun } from "global-data/ui";

const handleCliAdmin = ({ uify, history, bizLinkName }) => {
    setRun("runName", "goDash", uify);

    if (!bizLinkName) {
        const thisBizCodeName = getItems("bizData", ["bizLinkName"]);
        console.log(
            "thisBizCodeName APPACCESSALGORITHM CHECK",
            thisBizCodeName
        );
        return history.push(
            `/${thisBizCodeName}/cliente-admin/painel-de-controle`
        );
    }
    return history.push(`/${bizLinkName}/cliente-admin/painel-de-controle`);
};

const handleCliUser = ({ history }) => {
    history.push("/mobile-app");
};

export default async function handleOpenApp({
    uify,
    history,
    appRole,
    role_loggedIn,
    appId,
    appId_loggedIn,
    bizLinkName,
    clickedAppUserId,
    userId,
    bizId,
}) {
    if (role_loggedIn === "...") return null;

    const isBizTeam = role_loggedIn === "nucleo-equipe";
    const isCliAdmin = role_loggedIn === "cliente-admin";
    const isCliMember = role_loggedIn === "cliente-membro";
    const isCliUser = role_loggedIn === "cliente";

    const isFiddelizeApp = appRole === "nucleo-equipe";
    const isCliAdminApp = appRole === "cliente-admin";
    const isCliMemberApp = appRole === "cliente-membro";
    const isCliUserApp = appRole === "cliente";

    const isCurrApp = appId_loggedIn === appId;

    if (!isCurrApp) {
        await getAPI({
            method: "post",
            url: setDefaultAccess(),
            body: {
                userRole: appRole,
                appId,
                userId: clickedAppUserId,
            },
        });

        const userData = {
            uify,
            history,
            appPanelUserId: clickedAppUserId,
            appPanelRole: appRole,
        };

        await signInUserData(null, userData);
        // IMPORTANT: userId is used as the current id to be authorized by system. the clickedAppUserId, of course, it is clicked app id.
        await renewToken({
            userId,
            bizId,
            clickedAppUserId,
            role: appRole,
        });
    }

    if (!isFiddelizeApp) {
        await dontRememberAccess({ role: "nucleo-equipe" });
    }
    if (!isCliAdminApp) {
        await dontRememberAccess({ role: "cliente-admin" });
    }
    if (!isCliMemberApp) {
        await dontRememberAccess({ role: "cliente-membro" });
    }

    if (isCurrApp) {
        if (isBizTeam) {
            return history.push("/t/app/nucleo-equipe");
        }

        if (isCliAdmin) {
            return handleCliAdmin({ uify, history, bizLinkName });
        }

        if (isCliMemberApp) {
            return history.push("/t/app/equipe");
        }

        if (isCliUserApp) {
            return handleCliUser({ history });
        }
    }

    if (isBizTeam) {
        if (isCliAdminApp) {
            return handleCliAdmin({ uify, history, bizLinkName });
        }

        if (isCliMemberApp) {
            return history.push("/t/app/equipe");
        }

        if (isCliUserApp) {
            return handleCliUser({ history });
        }
    }

    if (isCliAdmin) {
        if (isFiddelizeApp) {
            return history.push("/t/app/nucleo-equipe");
        }

        // cli-admin apps can be multiple
        if (isCliAdminApp) {
            return handleCliAdmin({ uify, history, bizLinkName });
        }

        if (isCliMemberApp) {
            return history.push("/t/app/equipe");
        }

        if (isCliUserApp) {
            return handleCliUser({ history });
        }
    }

    if (isCliMember) {
        if (isFiddelizeApp) {
            return history.push("/t/app/nucleo-equipe");
        }

        if (isCliAdminApp) {
            return handleCliAdmin({ uify, history, bizLinkName });
        }

        if (isCliUserApp) {
            return handleCliUser({ history });
        }
    }

    // if curr app is cli-user password required for all other apps since it is not required authenticated login
    if (isCliUser) {
        const removeSession = async () => {
            // NOTE: sometimes, token is not removed. This is not an issue just yet since this token is simply informative so far.
            await removeVars(["success", "token"], "user");
            removeItems("currUser", ["token"]);
        };

        if (isFiddelizeApp) {
            await removeSession();
            return history.push("/t/app/nucleo-equipe/acesso");
        }

        if (isCliAdminApp) {
            await removeSession();
            return history.push("/senha-de-acesso");
        }

        if (isCliMemberApp) {
            await removeSession();
            return history.push("/senha-equipe");
        }

        // cli-user apps can be multiple
        if (isCliUserApp) {
            return handleCliUser({ history });
        }
    }

    console.log("error in appAccessAlgorithm.js");
}

async function dontRememberAccess({ role = "team-apps" }) {
    if (role === "cliente-admin") {
        return await removeVar("rememberAccess", "user");
    }

    // if there is no disconnect, then it will load in the password page. Login component removes it to redirect directly to this pass page.
    if (role === "cliente-membro") {
        return await setVar({ disconnectCliMember: true }, "user");
    }

    if (role === "nucleo-equipe") {
        return await setVar({ disconnectAgent: true }, "user");
    }
}
