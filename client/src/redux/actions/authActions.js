import axios from 'axios';
import { readUser, readCentralAdmin } from './userActions';
import { setLoadingProgress, setRun } from './globalActions';
import { showSnackbar } from './snackbarActions';
import { getHeaderJson } from '../../utils/server/getHeaders';
import { readCliAdmin } from '../../hooks/roles-storage-and-data-recovery/useRecoverSysData';
import isThisApp from '../../utils/window/isThisApp';
// import lStorage from '../../utils/storage/lStorage';
// naming structure: action > type > speficification e.g action: GET_MODAL_BLUE / func: getModalBlue
// import { postDataWithJsonObj } from '../../utils/promises/postDataWithJsonObj.js'


// Check token & load user
export const loadUser = () => (dispatch, getState) => {
    console.log('==USER LOADING==');
    axios.get('/api/auth/user', tokenConfig(getState))
    .then(res => {
        dispatch({ type: 'USER_ONLINE', payload: true });

        const role = res.data.profile.role;
        const userId = res.data.profile._id;
        const userDataPath = res.data.profile.clientUserData;
        const bizId = userDataPath && userDataPath.bizId;
        readCliAdmin(dispatch, role, {userId: userId, bizId: bizId || "0"});

        dispatch({ type: 'AUTHENTICATE_USER_ONLY' });
        dispatch({ type: 'USER_READ', payload: res.data.profile });
    })
    .catch(err => {
        const gotObj = err.response && err.response.data;
        const gotMsg = gotObj && err.response.data.msg && err.response.data.msg.length !== 0;
        if(gotObj && err.response.status === 500 && gotMsg) {
            dispatch({ type: 'USER_ONLINE', payload: false });
            showSnackbar(dispatch, "Modo Offline Ativado!", 'warning', 5000)
        }
        if(gotObj && err.response.status === 401 && gotMsg) {
            showSnackbar(dispatch, "Sua sessão terminou. Faça seu acesso novamente.", 'warning', 10000) // err.response.data.msg
            logout(dispatch, {needSnackbar: false});
        }
    });
};

// login Email
// loginEMail with Async/Await
export const loginEmail = async (dispatch, objToSend) => {
    setLoadingProgress(dispatch, true);
    try {
        const res = await axios.post('/api/auth/login', objToSend, getHeaderJson);

        readCliAdmin(dispatch, res.data.role, {userId: res.data.authUserId, bizId: res.data.bizId })
        readCentralAdmin(dispatch);
        // readUser(dispatch, res.data.authUserId) // moved to login

        dispatch({ type: 'LOGIN_EMAIL', payload: res.data.token });
        dispatch({ type: 'USER_ONLINE', payload: true });
        setLoadingProgress(dispatch, false);

        return res;
    } catch (err) {
        dispatch({
            type: 'LOGIN_ERROR'
        });
        setLoadingProgress(dispatch, false);
        return err.response;
    }
};

// Register User
// objToSend: { name, email, password, registeredBy = email }
export const registerEmail = async (dispatch, objToSend) => { // registerEmail does not requires to readUser or Admin obj because the app is not initionalized promptly. it is redirected to login or some other page.
    setLoadingProgress(dispatch, true);
    try {
        const res = await axios.post('/api/auth/register', objToSend, getHeaderJson);
        console.log("res", res);
        if(!res) {
            setTimeout(() => {
                showSnackbar(dispatch, "Parece que há problemas de conexão com a internet.")
            }, 10000);
        }
        setLoadingProgress(dispatch, false);
        dispatch({ type: 'USER_ONLINE', payload: true });
        return res;
    } catch(err) {
        dispatch({
            type: 'REGISTER_ERROR'
        });
        setLoadingProgress(dispatch, false);
        return err.response;
    }
};

// Register Social Networks - note: login is done conditionally in the their auth component
export const registerGoogle = (dispatch, body, resGoogle) => {
    axios.post('/api/auth/register', body, getHeaderJson)
    .then(res => {
        dispatch({ type: 'LOGIN_GOOGLE', payload: res.data.token })
        dispatch({ type: 'USER_GOOGLE_DATA', payload: resGoogle })
        readUser(dispatch, res.data.authUserId); // This will get the complementary data from user registered by social network
    })
    .catch(err => {
        return err.response;
    })
};

export const registerFacebook = (dispatch, body, resFacebook) => {
    axios.post('/api/auth/register', body, getHeaderJson)
    .then(res => {
        dispatch({ type: 'LOGIN_FACEBOOK', payload: res.data.token })
        dispatch({ type: 'USER_FACEBOOK_DATA', payload: resFacebook })
        readUser(dispatch, res.data.authUserId); // This will get the complementary data from user registered by social network
    })
    .catch(err => {
        return err.response;
    })
};
// Register Social Networks

export const logout = (dispatch, opts = {   }) => {
    const { needSnackbar = true, needReload = false } = opts;

    setRun(dispatch, "logout");

    if(needReload) {
        window.location.href = isThisApp() ? "/mobile-app" : "/";
    }
    dispatch({ type: 'LOGOUT_SUCCESS' });
    dispatch({ type: 'USER_CLEARED' });
    dispatch({ type: 'ALL_COMPONENTS_CLEARED' });
    setTimeout(() => needSnackbar && showSnackbar(dispatch, 'Sua sessão foi finalizada com sucesso!', 'warning', 4000), 2000);
};

export const changePassword = async (dispatch, bodyPass, userId) => {
    setLoadingProgress(dispatch, true);
    try {
        const res = await axios.post(`/api/auth/change-password?id=${userId}`, bodyPass, getHeaderJson);
        setLoadingProgress(dispatch, false);
        return res;
    } catch(err) {
        setLoadingProgress(dispatch, false);
        return err.response;
    }
}


// Setup config/headers and token
export const tokenConfig = getState => { // n2
    //getState method accesses redux store outside of a react component
    const token = getState().authReducer.cases.token;
    console.log('token from tokenConfig', token);
    // Headers
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    };

    // N1 If token, add to headers
    if (token) {
        config.headers['x-auth-token'] = token;
    }

    return config;
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