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

    if (msg) showToast("Finalizando sua sessão...", { dur: 15000 });

    const role = await getVar("role", "user");
    const isCliAdmin = role === "cliente-admin";

    if (!role) return null;

    await removeStore("user");
    removeCollection("currUser");

    // post essential data set
    if (isCliAdmin) await setVars({ rememberAccess }, "user");
    setItems("currUser", { role });
    // end

    if (!needRedirect && !history) return null;

    if (history) {
        return isApp ? history.push("/mobile-app") : history.push("/");
    }

    const destiny = isApp ? "/mobile-app" : "/acesso/verificacao";
    return (window.location.href = destiny);
}
