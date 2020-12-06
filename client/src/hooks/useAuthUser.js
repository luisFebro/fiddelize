import { useEffect } from "react";
import { useStoreState } from "easy-peasy";
import isThisApp from "../utils/window/isThisApp";
import useData from "../hooks/useData";
import { getVar, setMultiVar, store } from "../hooks/storage/useVar";

const isApp = isThisApp();
const gotToken = localStorage.getItem("token");

// the new logout without the need of dispatch or history.
// the logout from authActions will be depracated cuz is so depedent pf dispatch to work...
export const disconnect = async (options = {}) => {
    const { needRedirect = true } = options;

    const role = await getVar("role", store.user);
    const isMember = role === "cliente-membro";

    await setMultiVar(
        [{ success: false }, { rememberAccess: isMember ? false : true }],
        store.user
    );

    localStorage.removeItem("token");

    if (!needRedirect) return;
    const destiny = isApp ? "/mobile-app" : "/acesso/verificacao";
    window.location.href = destiny;
};

export default function useAuth(options = {}) {
    const { history } = options;

    const [success] = useData(["success"]);

    useEffect(() => {
        if (success === "...") return;

        const isAuthUser = success;
        console.log("isAuthUser", isAuthUser);

        if (!isAuthUser && history) {
            (async () => {
                await disconnect({ needRedirect: false });
                isApp ? history.push("/mobile-app") : history.push("/");
            })();
        }
    }, [success]);
}

// this will be depracated
// tokenWhenLogin assures that user holds a valid token since gotToken
// from local storage will only be assessed by the system in the next loading time.
// The current state will be null.
// The tokenWhenLogin completes the gotToken to verify the validity of access.
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
