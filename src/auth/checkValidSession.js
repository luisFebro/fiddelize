import getAPI, { checkValidSession as check } from "api";
import getVar from "init/var";
import disconnect from "auth/disconnect";

export default async function checkValidSession() {
    window.addEventListener("focus", async () => {
        // console.log(window.location.href);
        const isLoggedIn = await getVar("success", "user");
        const websitePages = [
            "/baixe-app",
            "/privacidade",
            "/novo-clube",
            "/app/preview",
        ];
        const isWebsitePage = websitePages.some((pg) =>
            window.location.href.includes(pg)
        );
        const arePublicPages =
            window.location.href.indexOf("app") >= 0 ||
            window.location.href.pathname === "/" ||
            window.location.href.indexOf("senha-de-acesso") >= 0 ||
            window.location.href.pathname === "/acesso/verificacao" ||
            isWebsitePage;

        if (arePublicPages || !isLoggedIn) return;

        const isValidSession = await getAPI({
            url: check(),
        });

        if (!isValidSession) await disconnect();
    });
}
