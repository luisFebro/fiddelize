import { useEffect } from "react";
import useData from "init";
import isThisApp from "utils/window/isThisApp";
import { removeCollection } from "init/lStorage";
import getVar, {
    setVars,
    removeCollection as removeIndexedColl,
} from "init/var";
import showToast from "components/toasts";

const isApp = isThisApp();

export default function useAuth(options = {}) {
    const { token } = useData();

    const { history, roles } = options;

    const [success, roleAllowed] = useData(["success", "role"]);

    useEffect(() => {
        if (success === "...") return;

        const theseRoles = roles && roles.includes(roleAllowed);
        const isAuthUser = success && theseRoles;

        // there's a focus verification to logout user automatically. Maybe this REDIRECT can be depracted in the future.
        if (!isAuthUser && history) {
            (async () => {
                await disconnect({ needRedirect: false });
                history.push(isApp ? "/mobile-app" : "/acesso/verificacao");
            })();
        }
    }, [success]);

    return Boolean(token || success);
}

// TODO: need to remove all logout from dispatch for new logic to work
export async function disconnect(options = {}) {
    const { needRedirect = true, msg = true } = options;

    if (msg) showToast("Finalizando sessão...");

    const role = await getVar("role", "user");
    const isCliAdmin = role === "cliente-admin";

    const setRememberAccess = async () => {
        if (!isCliAdmin) return null;
        return await setVars({ rememberAccess: true }, "user");
    };

    await Promise.all([setRememberAccess(), removeIndexedColl("user")]);

    removeCollection("currUser");

    if (!needRedirect) return;
    const destiny = isApp ? "/mobile-app?abrir=1" : "/acesso/verificacao";
    window.location.href = destiny;
}

/* ARCHIVES

export const useAuthUser = (options = {}) => {
    const { history } = options;

    const { tokenWhenLogin, runName } = useStoreState((state) => ({
        tokenWhenLogin: state.authReducer.cases.tokenWhenLogin,
        runName: state.globalReducer.cases.runName,
    }));

    const isLogout = runName === "logout";
    const isAuthorized =
        (!isLogout && gotToken && !tokenWhenLogin) ||
        (!gotToken && tokenWhenLogin) ||
        (gotToken && tokenWhenLogin);

    const isAuthUser = Boolean(isAuthorized);

    // REDIRECT TO MAIN PAGE IF USER IS NOT OR NO LONGER AUTHORIZED.
    useEffect(() => {
        if (!isAuthUser && history) {
            isThisApp() ? history.push("/mobile-app") : history.push("/");
        }
    }, [isAuthUser, history]);

    return { isAuthUser };
};

*/
