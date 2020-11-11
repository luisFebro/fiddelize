import { useEffect } from "react";
import { useStoreState } from "easy-peasy";
import isThisApp from "../utils/window/isThisApp";

const gotToken = localStorage.getItem("token");

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
