import axios from "axios";
import { readCentralAdmin } from "./userActions";
import { setLoadingProgress, setRun } from "./globalActions";
import { showSnackbar } from "./snackbarActions";
import { getHeaderJson } from "../../utils/server/getHeaders";
import { readCliAdmin } from "../../hooks/roles-storage-and-data-recovery/useRecoverSysData";
import isThisApp from "../../utils/window/isThisApp";
import { setVar, store } from "../../hooks/storage/useVar";
import { API } from "../../config/api";
// import lStorage from '../../utils/storage/lStorage';
// naming structure: action > type > speficification e.g action: GET_MODAL_BLUE / func: getModalBlue
// import { postDataWithJsonObj } from '../../utils/promises/postDataWithJsonObj.js'
const isApp = isThisApp();

// Check token & load user
const alreadyPass = false;
export const loadUser = () => (dispatch, getState) => (history) => {
    console.log("==USER LOADING==");
    axios
        .get(`${API}/auth/user`, tokenConfig(getState))
        .then((res) => {
            dispatch({ type: "USER_ONLINE", payload: true });

            // this is redirect to home even redirect links page...
            // that's why there is "isApp" to check if is not website
            // const gotError = isApp && res.data && res.data.error;
            // if (gotError) logout(dispatch, { history });

            const { role } = res.data.profile;
            const userId = res.data.profile._id;
            const userDataPath = res.data.profile.clientUserData;
            const bizId = userDataPath && userDataPath.bizId;
            readCliAdmin(dispatch, role, {
                userId,
                bizId: bizId || "0",
            });

            dispatch({ type: "AUTHENTICATE_USER_ONLY" });
            dispatch({ type: "USER_READ", payload: res.data.profile });
        })
        .catch((err) => {
            const gotObj = err.response && err.response.data;
            const gotMsg =
                gotObj &&
                err.response.data.msg &&
                err.response.data.msg.length !== 0;

            if (gotObj && err.response.status === 500 && gotMsg) {
                dispatch({ type: "USER_ONLINE", payload: false });
            }

            // to avoid infinite request loop
            const isUnavailablePage =
                window.location.href.indexOf(
                    "temporariamente-indisponivel-503"
                ) >= 0;
            if (
                err.response &&
                err.response.status === 503 &&
                !isUnavailablePage
            ) {
                window.location.href = "/temporariamente-indisponivel-503";
            }
            if (gotObj && err.response.status === 401 && gotMsg) {
                logout(dispatch, { history });
            }
        });
};

export const setUserOnline = (dispatch, status) => {
    dispatch({ type: "USER_ONLINE", payload: status });
};

// login Email
// loginEMail with Async/Await
export const loginEmail = async (dispatch, objToSend) => {
    setLoadingProgress(dispatch, true);
    try {
        const res = await axios.post(
            `${API}/auth/login`,
            objToSend,
            getHeaderJson
        );

        readCliAdmin(dispatch, res.data.role, {
            userId: res.data.authUserId,
            bizId: res.data.bizId,
        });
        readCentralAdmin(dispatch);
        // readUser(dispatch, res.data.authUserId) // moved to login

        dispatch({
            type: "LOGIN_EMAIL",
            payload: { token: res.data.token, role: res.data.role },
        });
        dispatch({ type: "USER_ONLINE", payload: true });
        setLoadingProgress(dispatch, false);

        return res;
    } catch (err) {
        console.log(`err${err}`);
        dispatch({
            type: "LOGIN_ERROR",
        });
        setLoadingProgress(dispatch, false);
        return err.response;
    }
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
                showSnackbar(
                    dispatch,
                    "Parece que há problemas de conexão com a internet."
                );
            }, 10000);
        }
        setLoadingProgress(dispatch, false);
        dispatch({ type: "USER_ONLINE", payload: true });
        return res;
    } catch (err) {
        setLoadingProgress(dispatch, false);
        return err.response;
    }
};

export const logout = async (dispatch, opts = {}) => {
    const { needReload = false, history } = opts;

    setRun(dispatch, "logout");

    if (history) {
        isApp ? history.push("/mobile-app") : history.push("/");
    }

    if (needReload) {
        window.location.href = isApp ? "/mobile-app" : "/";
    }
    dispatch({ type: "LOGOUT_SUCCESS" });
    dispatch({ type: "USER_CLEARED" });
    dispatch({ type: "ALL_COMPONENTS_CLEARED" });

    await setVar({ success: false }, store.user);
};

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

// Setup config/headers and token
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

/* ARCHIVES
showSnackbar(
    dispatch,
    "Sua sessão terminou. Faça seu acesso novamente.",
    "warning",
    10000
); // err.response.data.msg
 */

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
