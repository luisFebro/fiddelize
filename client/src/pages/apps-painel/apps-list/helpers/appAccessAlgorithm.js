import { setRun } from "../../../../redux/actions/globalActions";
import {
    removeVar,
    setVar,
    setMultiVar,
    store,
} from "../../../../hooks/storage/useVar";

export const handleOpenApp = async ({
    history,
    appRole,
    role_loggedIn,
    appId,
    appId_loggedIn,
    dispatch,
    bizCodeName,
}) => {
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
            setRun(dispatch, "goDash");
            return history.push(
                `/${bizCodeName}/cliente-admin/painel-de-controle`
            );
        }

        if (isCliMemberApp) {
            return history.push(`/t/app/equipe`);
        }

        if (isCliUserApp) {
            return history.push(`/mobile-app`);
        }
    }

    if (isBizTeam) {
        if (isCliAdminApp) {
            setRun(dispatch, "goDash");
            return history.push(
                `/${bizCodeName}/cliente-admin/painel-de-controle`
            );
        }

        if (isCliMemberApp) {
            return history.push(`/t/app/equipe`);
        }

        if (isCliUserApp) {
            return history.push(`/mobile-app`);
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
            return history.push(`/mobile-app`);
        }
    }

    if (isCliMember) {
        if (isFiddelizeApp) {
            return history.push(`/t/app/nucleo-equipe`);
        }

        if (isCliAdminApp) {
            setRun(dispatch, "goDash");
            return history.push(
                `/${bizCodeName}/cliente-admin/painel-de-controle`
            );
        }

        if (isCliUserApp) {
            return history.push(`/mobile-app`);
        }
    }

    if (isCliUser) {
        // if curr app is cli-user password required for all other apps since it is not required one
        if (isFiddelizeApp) {
            return history.push(`/t/app/nucleo-equipe/acesso`);
        }

        if (isCliAdminApp) {
            return history.push(`/senha-de-acesso`);
        }

        if (isCliMemberApp) {
            return history.push(`/senha-equipe`);
        }
    }

    return alert("other");
};

export async function dontRememberAccess({
    role = "team-apps",
    role_loggedIn,
}) {
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

    if (role === "team-apps") {
        if (role_loggedIn === "cliente-admin") {
            // disable remember access page to show login for the new toggled app.
            await setVar({ rememberAccess: false }, store.user);
        }

        return await setMultiVar(
            [{ disconnectCliMember: true }, { disconnectAgent: true }],
            store.user
        );
    }
}
