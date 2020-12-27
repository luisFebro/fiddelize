import { getMultiVar, setVar, store } from "../../../hooks/storage/useVar";
import isThisApp from "../../../utils/window/isThisApp";
// import { showSnackbar } from "../../../redux/actions/snackbarActions";

const isApp = isThisApp();

const handleDestiny = ({ role, bizCodeName }) => {
    if (role === "cliente-membro") return "/t/app/equipe";
    return isApp
        ? `/mobile-app`
        : `${bizCodeName}/cliente-admin/painel-de-controle?abrir=1`;
};

const handleRedirect = ({ role, destiny, history }) => {
    if (role === "cliente-membro") {
        history.push(destiny);
    } else {
        setTimeout(() => (window.location.href = destiny), 1500); // data is being deleted from localstorage.
    }
};

export default async function authenticate(newToken, options = {}) {
    const { history, role } = options;
    // these variables are set and avaiable after CPF login.
    localStorage.setItem("token", newToken);

    await setVar({ success: true }, store.user);

    const [userName, bizCodeName] = await getMultiVar(
        ["name", "bizCodeName"],
        store.user
    );

    await setVar({ welcomeMsg: true });

    const destiny = handleDestiny({ role, bizCodeName });

    handleRedirect({ role, destiny, history });

    return "ok";
}
