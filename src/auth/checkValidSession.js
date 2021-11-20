import getAPI, { checkValidSession as check } from "api";
import getVar from "init/var";
import disconnect from "auth/disconnect";

export default async function checkValidSession() {
    window.addEventListener("focus", runSessionCheck);
}

export async function runSessionCheck() {
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
        window.location.href.pathname === "/" ||
        window.location.href.indexOf("acesso") >= 0 ||
        isWebsitePage;
    // window.location.href.indexOf("app") >= 0 || allow checking in the main login areas
    // window.location.href.pathname === "/acesso/verificacao" ||

    if (arePublicPages || !isLoggedIn) return;

    const isValidSession = await getAPI({
        url: check(),
    });

    if (!isValidSession) await disconnect();
}
