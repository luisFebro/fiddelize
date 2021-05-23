import isThisApp from "utils/window/isThisApp";
import { removeCollection, setItems } from "init/lStorage";
import getVar, { setVars, removeStore } from "init/var";
import showToast from "components/toasts";

const isApp = isThisApp();

export default async function disconnect(options = {}) {
    const {
        needRedirect = true,
        msg = false,
        rememberAccess = true,
        history,
    } = options;
    if (!needRedirect && !history) return null;
    if (msg) showToast("Finalizando sua sessão...", { dur: 15000 });

    await removeStore("user");
    removeCollection("currUser");

    // post essential data set
    const role = await getVar("role", "user");
    const isCliAdmin = role === "cliente-admin";
    if (isCliAdmin) await setVars({ rememberAccess }, "user");
    if (role) setItems("currUser", { role });
    // end

    if (history) return isApp ? history.push("/mobile-app") : history.push("/");
    const destiny = isApp ? "/mobile-app" : "/acesso/verificacao";
    window.location.href = destiny;

    return null;
}
