import getAPI, { checkValidSession as check } from "api";
import getVar from "init/var";
import disconnect from "auth/disconnect";

export default async function checkValidSession() {
    window.addEventListener("focus", async () => {
        // console.log(window.location.href);
        const isLoggedIn = await getVar("success", "user");
        const arePublicPages =
            window.location.href.indexOf("mobile-app") >= 0 ||
            window.location.href.pathname === "/" ||
            window.location.href.indexOf("senha-de-acesso") >= 0 ||
            window.location.href.pathname === "/acesso/verificacao";

        if (arePublicPages || !isLoggedIn) return;

        const isValidSession = await getAPI({
            url: check(),
        });

        if (!isValidSession) await disconnect();
    });
}
