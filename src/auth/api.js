import showToast from "components/toasts";
import getAPI, { login, register, loadDataInit } from "api";
import setInitData from "init/setInitData";
import disconnect from "auth/disconnect";

export default async function loadInit(uify, history) {
    const res = await getAPI({
        method: "post",
        url: loadDataInit(),
        fullCatch: true,
    }).catch((err) => {
        if (!err) return;

        const errorMsg = err.data && err.data.error;

        // to avoid infinite request loop
        const isUnavailablePage =
            window.location.href.indexOf("temporariamente-indisponivel-503") >=
            0;
        if (err.status === 503 && !isUnavailablePage) {
            window.location.href = "/temporariamente-indisponivel-503";
        }
        if (err.status === 401 && errorMsg === "A sua sessão terminou") {
            disconnect({ history, msg: false, needRedirect: false });
        }
    });

    if (!res) return;

    await setInitData(res.data, { uify });
}

// objToSend: { name, email, password, registeredBy = email }
export const doRegister = async (objToSend) => {
    const res = await getAPI({
        method: "post",
        url: register(),
        body: objToSend,
        timeout: 30000,
        loader: true,
        fullCatch: true,
    }).catch((err) => {
        if (!err) return null;
        return err;
        // const errorMsg = err.data && err.data.error;
        // if(!errorMsg) showToast("Ocorreu um erro de conexão", { type: "error" });
    });

    if (!res) return null;

    return res;
};

export const doLogin = async (uify, objToSend) => {
    const res = await getAPI({
        method: "post",
        url: login(),
        body: objToSend,
        timeout: 30000,
        loader: true,
        fullCatch: true,
    }).catch((err) => {
        if (!err) return null;
        const errorMsg = err.data && err.data.error;
        if (errorMsg) return showToast(errorMsg, { type: "error" });

        showToast(
            "Não foi possível conectar. Verifique sua conexão e tente novamente.",
            {
                type: "error",
            }
        );
        console.log(`ERROR: ${err.response}`);
        return null;
    });

    if (!res) return null;

    await setInitData(res.data, { uify });

    return res;
};

/* COMMENTS
n1: eg when user authenticated
{
    headers: {
        Content-type: "application/json"
        x-auth-token: "eyJhbGciOiJIUzI1NiIsInR5..."
    }
}

n2: getState need to be wrapped inside redux dispatch function in order to work properly. eg dispatch(loadUser(getState))
*/

/* ARCHIVES
Setup config/headers and token
export const tokenConfig = (getState) => {
    // n2
    // getState method accesses redux store outside of a react component
    const { token } = getState().authReducer.cases;
    console.log("token from tokenConfig", token);
    // Headers
    const config = {
        headers: {
            "Content-type": "application/json",
        },
    };

    // N1 If token, add to headers
    if (token) {
        config.headers["x-auth-token"] = token;
    }

    return config;
};

*/
