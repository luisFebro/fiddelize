import getAPI, { checkValidSession as check } from "api";
import disconnect from "auth/disconnect";
import getItems from "init/lStorage";
import { websitePages } from "utils/window/isThisApp";

export default async function checkValidSession() {
    window.addEventListener("focus", runSessionCheck);
}

export async function runSessionCheck() {
    const [token] = getItems("currUser", ["token"]);
    const isLoggedIn = Boolean(token);

    // redirect users logout in whatever private page
    if (arePublicPages()) return;

    if (isPrivatePage() || !isLoggedIn) {
        const isUnauthPriPage = isPrivatePage() && !isLoggedIn;
        if (isUnauthPriPage) await disconnect({ onlyRedirect: true });
        if (!isLoggedIn) return;
    }

    const isValidSession = await getAPI({
        url: check(),
    });

    if (!isValidSession) await disconnect();
}

// HELPERS
function arePublicPages() {
    const isWebsitePage = websitePages.some((pg) =>
        window.location.href.includes(pg)
    );

    const result =
        window.location.href.pathname === "/" ||
        window.location.href.indexOf("acesso") >= 0 ||
        isWebsitePage;
    // window.location.href.indexOf("app") >= 0 || allow checking in the main login areas
    // window.location.href.pathname === "/acesso/verificacao" ||

    return result;
}

function isPrivatePage() {
    const privatePages = [
        "/t/app/nucleo-equipe",
        "/cliente-admin/painel-de-controle",
        "/t/app/equipe",
    ];

    return privatePages.some((pg) => window.location.href.includes(pg));
}
// END HELPERS
