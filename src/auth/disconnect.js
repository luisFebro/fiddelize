import isThisApp from "utils/window/isThisApp";
import { removeCollection } from "init/lStorage";
import getVar, {
    setVars,
    removeCollection as removeIndexedColl,
} from "init/var";
import showToast from "components/toasts";

const isApp = isThisApp();

export default async function disconnect(options = {}) {
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
