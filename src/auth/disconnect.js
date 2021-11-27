import isThisApp from "utils/window/isThisApp";
import { removeItems } from "init/lStorage"; // removeCollection, setItems,
import getVar, { setVars } from "init/var";
import showToast from "components/toasts";
import showProgress from "components/loadingIndicators/progress";

const isApp = isThisApp();

export default async function disconnect(options = {}) {
    const {
        needRedirect = true,
        msg = false,
        history,
        rememberAccess = true,
    } = options;
    if (!needRedirect && !history) return null;

    showProgress("go");
    if (msg) showToast("Finalizando sua sessão...", { dur: 15000 });

    const [role] = await Promise.all([
        getVar("role", "user"),
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
    ]);
    // data from user remains for avoiding login requests every login-password access. The local data will be reusable // For future updates, we can delete the entire user data if they logout from their account instead of simply logout from session
    removeItems("currUser", ["token"]);

    // post essential data set
    const isCliAdmin = role === "cliente-admin";
    if (isCliAdmin)
        await setVars(
            { rememberAccess }, // userId, name, twoLastCpfDigits
            "user"
        ).catch((err) => `ERROR disconnect setVars ${err}`);
    // end

    if (history) return isApp ? history.push("/app") : history.push("/");
    const destiny = isApp ? "/app" : "/acesso/verificacao";

    window.location.href = destiny;
    return null;
}

/* ARCHIVES

const [role, userId, name, twoLastCpfDigits] = await getVars(
    ["role", "userId", "name", "twoLastCpfDigits"],
    "user"
);
async function removeLocalCollectionAsync() {
    const run = (resolve) => {
        removeCollection("currUser");
        resolve("ok");
    };

    return new Promise(run);
}

*/
