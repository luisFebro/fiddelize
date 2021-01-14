import { setRun } from "../../../../redux/actions/globalActions";
import { removeVar, store } from "../../../../hooks/storage/useVar";

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
    const isAdminApp = appRole === "cliente-admin";
    const isAdmTeamApp = appRole === "cliente-membro";
    const isUserApp = appRole === "cliente";

    const isCurrApp = appId_loggedIn === appId;

    if (!isAdminApp) {
        await dontRememberAccess();
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

        if (isAdmTeamApp) {
            return history.push(`/t/app/equipe`);
        }

        if (isCliUser) {
            return history.push(`/mobile-app`);
        }
    }

    if (isBizTeam) {
        if (isAdminApp) {
            setRun(dispatch, "goDash");
            return history.push(
                `/${bizCodeName}/cliente-admin/painel-de-controle`
            );
        }

        if (isAdmTeamApp) {
            return history.push(`/t/app/equipe`);
        }

        if (isCliUser) {
            return history.push(`/mobile-app`);
        }
    }

    if (isCliAdmin) {
        if (isFiddelizeApp) {
            return history.push(`/t/app/nucleo-equipe`);
        }

        if (isAdmTeamApp) {
            return history.push(`/t/app/equipe`);
        }

        if (isCliUser) {
            return history.push(`/mobile-app`);
        }
    }

    if (isAdmTeamApp) {
        if (isFiddelizeApp) {
            return history.push(`/t/app/nucleo-equipe`);
        }

        if (isAdminApp) {
            setRun(dispatch, "goDash");
            return history.push(
                `/${bizCodeName}/cliente-admin/painel-de-controle`
            );
        }

        if (isCliUser) {
            return history.push(`/mobile-app`);
        }
    }

    if (isCliUser) {
        // if curr app is cli-user password required for all other apps since it is not required one
        if (isFiddelizeApp) {
            return history.push(`/t/app/nucleo-equipe/acesso`);
        }

        if (isAdminApp) {
            return history.push(`/senha-de-acesso`);
        }

        if (isAdmTeamApp) {
            return history.push(`/senha-equipe`);
        }
    }

    return alert("other");
};

async function dontRememberAccess() {
    return await removeVar("rememberAccess", store.user);
}
