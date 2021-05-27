import isThisApp from "utils/window/isThisApp";
import { removeCollection, setItems } from "init/lStorage";
import getVar, { setVars, removeStore } from "init/var";
import showToast from "components/toasts";
import showProgress from "components/loadingIndicators/progress";

const isApp = isThisApp();

export default async function disconnect(options = {}) {
    const {
        needRedirect = true,
        msg = false,
        rememberAccess = true,
        history,
    } = options;
    if (!needRedirect && !history) return null;
    if (msg) {
        showProgress("go");
        showToast("Finalizando sua sessão...", { dur: 15000 });
    }

    const [role] = await Promise.all([
        getVar("role", "user"),
        removeStore("user"),
        removeCollAsync(),
    ]);

    // post essential data set
    const isCliAdmin = role === "cliente-admin";
    if (isCliAdmin) await setVars({ rememberAccess }, "user");
    if (role) setItems("currUser", { role });
    // end

    if (history) return isApp ? history.push("/mobile-app") : history.push("/");
    const destiny = isApp ? "/mobile-app" : "/acesso/verificacao";

    window.location.href = destiny;
    return null;
}

async function removeCollAsync() {
    const run = (resolve, reject) => {
        removeCollection("currUser");
        resolve("ok");
    };

    return new Promise(run);
}
