import axios from "axios";
import showToast from "components/toasts";
import { getHeaderJson } from "utils/server/getHeaders";
import isThisApp from "utils/window/isThisApp";
import { setVar } from "init/var";
import { API } from "config/api";
import getAPI, { login, loadUserInit } from "utils/promises/getAPI";
import setInitData from "init/setInitData";
import { setLoadingProgress, setRun } from "./globalActions";
// naming structure: action > type > speficification e.g action: GET_MODAL_BLUE / func: getModalBlue
// import { postDataWithJsonObj } from '../../utils/promises/postDataWithJsonObj.js'
const isApp = isThisApp();

// Check token & load user
export const loadUser = async (dispatch, history) => {
    const res = await getAPI({
        method: "post",
        url: loadUserInit(),
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
            logout(dispatch, { history });
        }
    });

    if (!res) return;

    const initData = res.data;
    const { role } = initData.currUser;

    await setInitData(role, { initData, dispatch });

    triggerInitDispatch(dispatch, res);
};

// login Email
// loginEMail with Async/Await
export const loginEmail = async (dispatch, objToSend) => {
    setLoadingProgress(dispatch, true);

    const res = await getAPI({
        method: "post",
        url: login(),
        body: objToSend,
        timeout: 30000,
    }).catch((err) => {
        console.log(`err${err}`);
        dispatch({
            type: "LOGIN_ERROR",
        });
        setLoadingProgress(dispatch, false);
        return err.response;
    });

    if (!res) return {};

    setLoadingProgress(dispatch, false);

    triggerInitDispatch(dispatch, res, true);

    return res;
};

// Register User
// objToSend: { name, email, password, registeredBy = email }
export const registerEmail = async (dispatch, objToSend) => {
    // registerEmail does not requires to readUser or Admin obj because the app is not initionalized promptly. it is redirected to login or some other page.
    setLoadingProgress(dispatch, true);
    try {
        const res = await axios.post(
            `${API}/auth/register`,
            objToSend,
            getHeaderJson
        );
        if (!res) {
            setTimeout(() => {
                showToast("Parece que há problemas de conexão com a internet.");
            }, 10000);
        }
        setLoadingProgress(dispatch, false);
        return res;
    } catch (err) {
        setLoadingProgress(dispatch, false);
        return err.response;
    }
};

export async function logout(dispatch, opts = {}) {
    const { needReload = false, history } = opts;

    setRun(dispatch, "logout");

    if (history) {
        if (isApp) history.push("/mobile-app");
        else history.push("/");
    }

    if (needReload) {
        window.location.href = isApp ? "/mobile-app" : "/";
    }
    dispatch({ type: "LOGOUT_SUCCESS" });
    dispatch({ type: "ALL_COMPONENTS_CLEARED" });

    await setVar({ success: false }, "user");
}

export const changePassword = async (dispatch, bodyPass, userId) => {
    setLoadingProgress(dispatch, true);
    try {
        const res = await axios.post(
            `${API}/auth/change-password?id=${userId}`,
            bodyPass,
            getHeaderJson
        );
        setLoadingProgress(dispatch, false);
        return res;
    } catch (err) {
        setLoadingProgress(dispatch, false);
        return err.response;
    }
};

// HELPERS
function triggerInitDispatch(dispatch, res, isLogin) {
    dispatch({
        type: "CLIENT_ADMIN_READ",
        payload: res.data.bizData,
    });

    if (isLogin) {
        dispatch({
            type: "LOGIN_EMAIL",
            payload: { token: res.data.token, role: res.data.currUser.role },
        });
    } else {
        // USER_READ is being dispatch in the login so that indexDB data can be updated in the login boot up.
        // IMPORTANT LESSON: if you dispatch again an action, it will have no affect and no update.
        dispatch({ type: "USER_READ", payload: res.data.currUser });
    }
}
// END HELPERS

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
