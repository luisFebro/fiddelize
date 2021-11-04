import isThisApp from "utils/window/isThisApp";
import { removeCollection, setItems } from "init/lStorage";
import { getVars, setVars } from "init/var";
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

    showProgress("go");
    if (msg) showToast("Finalizando sua sessão...", { dur: 15000 });

    const [role, userId, name, twoLastCpfDigits] = await getVars(
        ["role", "userId", "name", "twoLastCpfDigits"],
        "user"
    );

    await Promise.all([
        setVars(
            {
                success: false,
                token: false,
                appId: false,
                birthday: false,
                email: false,
            },
            "user"
        ),
        removeLocalCollectionAsync(),
    ]);

    // post essential data set
    const isCliAdmin = role === "cliente-admin";
    if (isCliAdmin)
        await setVars(
            { rememberAccess, userId, name, twoLastCpfDigits },
            "user"
        ).catch((err) => `ERROR disconnect setVars ${err}`);
    if (role) setItems("currUser", { role });
    // end

    if (history) return isApp ? history.push("/app") : history.push("/");
    const destiny = isApp ? "/app" : "/acesso/verificacao";

    window.location.href = destiny;
    return null;
}

async function removeLocalCollectionAsync() {
    const run = (resolve) => {
        removeCollection("currUser");
        resolve("ok");
    };

    return new Promise(run);
}
