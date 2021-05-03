import isThisApp from "utils/window/isThisApp";
import { removeCollection } from "init/lStorage";
import getVar, { setVars, removeStore } from "init/var";
import showToast from "components/toasts";

const isApp = isThisApp();

export default async function disconnect(options = {}) {
    const {
        needRedirect = true,
        msg = true,
        rememberAccess = true,
        history,
    } = options;

    if (msg) showToast("Finalizando sessão...");

    const role = await getVar("role", "user");
    const isCliAdmin = role === "cliente-admin";

    const setRememberAccess = async () => {
        if (!isCliAdmin) return null;
        return await setVars({ rememberAccess }, "user");
    };

    await Promise.all([setRememberAccess(), removeStore("user")]);

    removeCollection("currUser");

    if (!needRedirect && !history) return null;

    if (history) {
        return isApp ? history.push("/mobile-app") : history.push("/");
    }

    const destiny = isApp ? "/mobile-app" : "/acesso/verificacao";
    window.location.href = destiny;
}
