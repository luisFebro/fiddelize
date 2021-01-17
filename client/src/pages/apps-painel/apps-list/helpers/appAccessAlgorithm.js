import { setRun } from "../../../../redux/actions/globalActions";
import {
    removeVar,
    setVar,
    getVar,
    removeMultiVar,
    store,
} from "../../../../hooks/storage/useVar";
import renewAccessToken from "../../../../components/auth/helpers/renewAccessToken";
import lStorage from "../../../../utils/storage/lStorage";
import { signInUserData } from "../../../../components/auth/Login";
import getAPI, { setDefaultAccess } from "../../../../utils/promises/getAPI";

const handleCliAdmin = ({ bizId, dispatch, history, bizCodeName }) => {
    const updatedValues = {
        roleWhichDownloaded: "cliente-admin",
        businessId: bizId,
    };
    lStorage("setItems", { collection: "appSystem", newObj: updatedValues });

    setRun(dispatch, "goDash");

    if (!bizCodeName) {
        (async () => {
            const thisBizCodeName = await getVar("bizCodeName", store.user);
            return history.push(
                `/${thisBizCodeName}/cliente-admin/painel-de-controle`
            );
        })();
    }
    return history.push(`/${bizCodeName}/cliente-admin/painel-de-controle`);
};

const handleCliUser = ({ bizId, history }) => {
    const updatedValues = { roleWhichDownloaded: "cliente", businessId: bizId };
    lStorage("setItems", { collection: "appSystem", newObj: updatedValues });
    // need to reload so that some variables in the local storage can be loaded properly.
    return (window.location.href = `/mobile-app`);
};

export default async function handleOpenApp({
    history,
    appRole,
    role_loggedIn,
    appId,
    appId_loggedIn,
    dispatch,
    bizCodeName,
    clickedAppUserId,
    userId,
    bizId,
}) {
    if (role_loggedIn === "...") return;

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
                appId: appId,
                userId: clickedAppUserId,
            },
        }).catch((e) => {
            console.log(e.error);
        });

        const userData = {
            dispatch,
            history,
            appPanelUserId: clickedAppUserId,
            appPanelRole: appRole,
        };

        await signInUserData(null, userData);
        // IMPORTANT: userId is used as the current id to be authorized by system. the clickedAppUserId, of course, it is clicked app id.
        await renewAccessToken({
            userId,
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
            return history.push(`/t/app/nucleo-equipe`);
        }

        if (isCliAdmin) {
            return handleCliAdmin({ bizId, dispatch, history, bizCodeName });
        }

        if (isCliMemberApp) {
            return history.push(`/t/app/equipe`);
        }

        if (isCliUserApp) {
            return handleCliUser({ bizId, history });
        }
    }

    if (isBizTeam) {
        if (isCliAdminApp) {
            return handleCliAdmin({ bizId, dispatch, history, bizCodeName });
        }

        if (isCliMemberApp) {
            return history.push(`/t/app/equipe`);
        }

        if (isCliUserApp) {
            return handleCliUser({ bizId, history });
        }
    }

    if (isCliAdmin) {
        if (isFiddelizeApp) {
            return history.push(`/t/app/nucleo-equipe`);
        }

        if (isCliMemberApp) {
            return history.push(`/t/app/equipe`);
        }

        if (isCliUserApp) {
            return handleCliUser({ bizId, history });
        }
    }

    if (isCliMember) {
        if (isFiddelizeApp) {
            return history.push(`/t/app/nucleo-equipe`);
        }

        if (isCliAdminApp) {
            return handleCliAdmin({ bizId, dispatch, history, bizCodeName });
        }

        if (isCliUserApp) {
            return handleCliUser({ bizId, history });
        }
    }

    // if curr app is cli-user password required for all other apps since it is not required authenticated login
    if (isCliUser) {
        const removeSession = async () => {
            // NOTE: sometimes, token is not removed. This is not an issue just yet since this token is simply informative so far.
            await removeMultiVar(["success", "token"], store.user);
            localStorage.removeItem("token");
        };

        if (isFiddelizeApp) {
            await removeSession();
            return history.push(`/t/app/nucleo-equipe/acesso`);
        }

        if (isCliAdminApp) {
            await removeSession();
            return history.push(`/senha-de-acesso`);
        }

        if (isCliMemberApp) {
            await removeSession();
            return history.push(`/senha-equipe`);
        }
    }

    return alert("error");
}

async function dontRememberAccess({ role = "team-apps" }) {
    if (role === "cliente-admin") {
        return await removeVar("rememberAccess", store.user);
    }

    // if there is no disconnect, then it will load in the password page. Login component removes it to redirect directly to this pass page.
    if (role === "cliente-membro") {
        return await setVar({ disconnectCliMember: true }, store.user);
    }

    if (role === "nucleo-equipe") {
        return await setVar({ disconnectAgent: true }, store.user);
    }
}

/* ARCHIVES
// if (role === "team-apps") {
//     if (role_loggedIn === "cliente-admin") {
//         // disable remember access page to show login for the new toggled app.
//         await setVar({ rememberAccess: false }, store.user);
//     }

//     return await setMultiVar(
//         [{ disconnectCliMember: true }, { disconnectAgent: true }],
//         store.user
//     );
// }
*/
