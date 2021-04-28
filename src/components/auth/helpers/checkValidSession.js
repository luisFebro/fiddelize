import getAPI, { checkValidSession as check } from "utils/promises/getAPI";
import { getVar, store } from "hooks/storage/useVar";
import { disconnect } from "hooks/useAuthUser";

export default async function checkValidSession() {
    window.addEventListener("focus", async () => {
        // console.log(window.location.href);
        const isLoggedIn = await getVar("success", store.user);
        const arePublicPages =
            window.location.href.indexOf("mobile-app") >= 0 ||
            window.location.href.pathname === "/" ||
            window.location.href.indexOf("senha-de-acesso") >= 0 ||
            window.location.href.pathname === "/acesso/verificacao";

        if (arePublicPages || !isLoggedIn) return;

        const session = await getAPI({
            url: check(),
        }).catch(console.log);

        const isValidSession = session && session.data;
        if (!isValidSession) await disconnect();
    });
}
