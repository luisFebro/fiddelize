import { useEffect } from "react";
import useData from "init";
import isThisApp from "utils/window/isThisApp";
import disconnect from "auth/disconnect";

const isApp = isThisApp();

export default function useAuth(options = {}) {
    const [success, token, currRole] = useData(["success", "token", "role"], {
        dots: false,
    });

    const { history, roles } = options;

    useEffect(() => {
        if (!success) return;

        const theseRoles = roles && roles.includes(currRole);
        const isAuthUser = success && theseRoles;

        // there's a focus verification to logout user automatically. Maybe this REDIRECT can be depracted in the future.
        if (!isAuthUser && history) {
            (async () => {
                await disconnect({ needRedirect: false, msg: false });
                history.push(isApp ? "/mobile-app" : "/acesso/verificacao");
            })();
        }

        // eslint-disable-next-line
    }, [success, currRole]);

    return Boolean(token || success);
}
