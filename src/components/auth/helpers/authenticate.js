import { getVars, setVars, setVar } from "init/var";
import isThisApp from "../../../utils/window/isThisApp";

const isApp = isThisApp();

const handleDestiny = ({ role, bizLinkName }) => {
    if (role === "nucleo-equipe") return "/t/app/nucleo-equipe";
    if (role === "cliente-membro") return "/t/app/equipe";
    if (role === "cliente-admin")
        return isApp
            ? "/mobile-app"
            : `${bizLinkName}/cliente-admin/painel-de-controle?abrir=1`;
};

const handleRedirect = ({ role, destiny, history }) => {
    if (role === "cliente-membro" || role === "nucleo-equipe") {
        history.push(destiny);
    }

    if (role === "cliente-admin") {
        setTimeout(() => (window.location.href = destiny), 1500); // data is being deleted from localstorage.
    }
};

export default async function authenticate(newToken, options = {}) {
    const { history, role } = options;
    // these variables are set and avaiable after CPF login.
    localStorage.setItem("token", newToken);

    await setVars({ success: true, token: newToken }, "user");

    const [bizLinkName] = await getVars(["bizLinkName"], "user");

    if (role === "cliente-admin") {
        await setVar({ welcomeMsg: true });
    }

    const destiny = handleDestiny({ role, bizLinkName });

    handleRedirect({ role, destiny, history });

    return "ok";
}
