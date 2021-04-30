import { useEffect } from "react";
import { useStoreState } from "easy-peasy";
import isThisApp from "utils/window/isThisApp";
import { removeCollection } from "init/lStorage";
import { removeCollection as removeIndexedColl } from "hooks/storage/useVar";
import showToast from "components/toasts";
import useData from "./useData";
import { getVar, setMultiVar, store } from "./storage/useVar";

const isApp = isThisApp();
const gotToken = localStorage.getItem("token");

// the new logout without the need of dispatch or history.
// the logout from authActions will be depracated cuz is so depedent pf dispatch to work...
export const disconnect = async (options = {}) => {
    const { needRedirect = true, msg = true } = options;

    if (msg) showToast("Finalizando sessão...");

    const role = await getVar("role", store.user);
    const isCliAdmin = role === "cliente-admin";

    const setRememberAccess = async () => {
        if (!isCliAdmin) return null;
        return await setMultiVar({ rememberAccess: true }, store.user);
    };

    await Promise.all([setRememberAccess(), removeIndexedColl("user")]);

    localStorage.removeItem("token");
    removeCollection("currUser");

    if (!needRedirect) return;
    const destiny = isApp ? "/mobile-app?abrir=1" : "/acesso/verificacao";
    window.location.href = destiny;
};

export default function useAuth(options = {}) {
    const { history, roles } = options;

    if (!roles) throw new Error("roles and history is required!");

    const [success, roleAllowed] = useData(["success", "role"]);

    useEffect(() => {
        if (success === "...") return;

        const isAuthUser = success && roles.includes(roleAllowed);

        if (!isAuthUser && history) {
            (async () => {
                await disconnect({ needRedirect: false });
                history.push(isApp ? "/mobile-app" : "/acesso/verificacao");
            })();
        }
    }, [success]);
}

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

    return {
        isAuthUser,
        gotToken, // This is depracated.
    };
};
