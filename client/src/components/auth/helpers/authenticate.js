import { getMultiVar, setVar, store } from "../../../hooks/storage/useVar";
import isThisApp from "../../../utils/window/isThisApp";
import { showSnackbar } from "../../../redux/actions/snackbarActions";
import getFirstName from "../../../utils/string/getFirstName";

const isApp = isThisApp();

export default async function authenticate(newToken, options = {}) {
    const { dispatch, history } = options;
    // these variables are set and avaiable after CPF login.

    const [userName, bizCodeName] = await getMultiVar(
        ["name", "bizCodeName"],
        store.user
    );

    await setVar({ success: true }, store.user);

    localStorage.setItem("token", newToken);

    const destiny = isApp
        ? `/mobile-app`
        : `${bizCodeName}/cliente-admin/painel-de-controle?abrir=1`;

    history.push(destiny);
    // if(isApp) {
    //     window.location.href = destiny; // sometimes gatekeeper is not loaded.
    // } else {
    // }

    showSnackbar(
        dispatch,
        `Olá de volta, ${userName && getFirstName(userName.cap())}!`,
        "success"
    );
}
