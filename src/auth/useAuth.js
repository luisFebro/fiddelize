import { useEffect } from "react";
import useData from "init";
import isThisApp from "utils/window/isThisApp";
import disconnect from "auth/disconnect";

const isApp = isThisApp();

export default function useAuth(options = {}) {
    const [success, token, currRole] = useData(["success", "token", "role"]);

    const { history, roles } = options;

    useEffect(() => {
        if (success === "...") return;

        const theseRoles = roles && roles.includes(currRole);
        const isAuthUser = success && theseRoles;

        // there's a focus verification to logout user automatically. Maybe this REDIRECT can be depracted in the future.
        if (!isAuthUser && history) {
            (async () => {
                await disconnect({ needRedirect: false });
                history.push(isApp ? "/mobile-app" : "/acesso/verificacao");
            })();
        }

        // eslint-disable-next-line
    }, [success, currRole]);

    return Boolean(token || success);
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
