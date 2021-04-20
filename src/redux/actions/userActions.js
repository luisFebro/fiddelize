import axios from "axios";
import { getHeaderJson } from "../../utils/server/getHeaders";
import { API } from "../../config/api"; // ${API}
// import { tokenConfig } from './authActions';
// naming structure: action > type > speficification e.g action: GET_MODAL_BLUE / func: getModalBlue

// MAIN DATA LOADING
export const readUser = async (dispatch, _userId, options = {}) => {
    const { select, role } = options;
    let selectQuery = "";
    if (select) selectQuery = `?select=${select}`;

    let roleQuery = "";
    if (!select && role) {
        roleQuery = `?thisRole=${role}`;
    } else {
        roleQuery = `&thisRole=${role}`;
    }

    const res = await axios.get(
        `${API}/user/${_userId}${selectQuery}${roleQuery}`,
        getHeaderJson
    );
    console.log("===CURRENT USER LOADED===");
    !select && dispatch({ type: "USER_READ", payload: res.data });

    return res;
};

export const readClientAdmin = async (dispatch, _userId) => {
    const select =
        "clientAdminData.bizName clientAdminData.bizCodeName clientAdminData.bizPlan clientAdminData.bizWhatsapp clientAdminData.rewardScore clientAdminData.mainReward clientAdminData.rewardList clientAdminData.rewardDeadline clientAdminData.totalClientUserActiveScores clientAdminData.totalClientUserScores clientAdminData.totalClientUsers clientAdminData.selfBizLogoImg clientAdminData.selfMilestoneIcon clientAdminData.selfThemePColor clientAdminData.selfThemeSColor clientAdminData.selfThemeBackColor clientAdminData.arePrizesVisible";

    const res = await axios.get(
        `${API}/user/${_userId}?clientAdminRequest=true&thisRole=cliente-admin&select=${select}`,
        getHeaderJson
    );
    dispatch({
        type: "CLIENT_ADMIN_READ",
        payload: res.data,
    });
    return res;
};

export const readCentralAdmin = async (dispatch) => {
    try {
        // setLoadingOn(dispatch);
        const res = await axios.get(`${API}/admin`, getHeaderJson);
        console.log("==CENTRAL ADMIN LOADED==");
        dispatch({ type: "CENTRAL_ADMIN_READ", payload: res.data });
        return res;
        // setLoadingOff(dispatch);
    } catch (err) {
        return err.response;
    }
};
// END MAIN DATA LOADING

export const updateUser = async (dispatch, objToSend, _idUser, opts = {}) => {
    // selectKeys: is a string with only the keys requires to return.
    // noResponse: update but do not return any data as response.
    const { selectKeys, noResponse, thisRole } = opts;
    const selectQuery = selectKeys ? `selectKeys=${selectKeys}` : "";
    const noResponseQuery = !noResponse
        ? "&noResponse=true"
        : "&noResponse=false";
    const thisRoleQuery = thisRole ? `&thisRole=${thisRole}` : "";

    try {
        const res = await axios.put(
            `${API}/user/${_idUser}?${selectQuery}${noResponseQuery}${thisRoleQuery}`,
            objToSend,
            getHeaderJson
        );
        // dispatch({ type: 'USER_UPDATED', payload: needDispatch ? updateObj : null });
        return res;
    } catch (err) {
        return err;
    }
};

// export const deleteUser = async (dispatch, _idUser) => { // n1
//     try {
//         const res = await axios.delete(`/api/user/${_idUser}`, getHeaderJson);
//         dispatch({ type: 'USER_DELETED', payload: _idUser });
//         return res;
//     } catch(err) {
//         return err.response;
//     }
// };
// END RUD

// PURCHASE HISTORY
// addPurchaseHistory is on requestLib

export const readPurchaseHistory = async (
    _idUser,
    rewardScore,
    options = {}
) => {
    // n1
    // noResponse is used on ClientScoresPanel and aims to update the purchase list with the most recent prize in the backend. Avoid users to have to access the purchase history to update...
    const {
        noResponse,
        skip,
        limit,
        challengeN,
        prizeDesc,
        trophyIcon,
        trigger = true,
        thisRole = "cliente",
    } = options;

    if (!trigger) return;

    let noResponseQuery = "";
    let skipQuery = "";
    let limitQuery = "";
    let scoreQuery = "";
    let prizeDescQuery = "";
    let trophyIconQuery = "";
    if (skip || skip === 0) skipQuery = `&skip=${skip}`;
    if (limit) limitQuery = `&limit=${limit}`;
    if (challengeN) scoreQuery = `&challengeN=${challengeN}`;
    // Queries below for reading the prizes on clientScorePanel
    if (noResponse) noResponseQuery = "&noResponse=true";
    if (prizeDesc) prizeDescQuery = `&prizeDesc=${prizeDesc}`;
    if (trophyIcon) trophyIconQuery = `&trophyIcon=${trophyIcon}`;

    try {
        return await axios.get(
            `${API}/user/list/purchase-history/${_idUser}?rewardScore=${rewardScore}&thisRole=${thisRole}${noResponseQuery}${skipQuery}${limitQuery}${scoreQuery}${prizeDescQuery}${trophyIconQuery}`,
            getHeaderJson
        );
    } catch (err) {
        return err.response;
    }
};

export const changePrizeStatus = async (userId, options = {}) => {
    // n1
    const { statusType, prizeId } = options;

    try {
        return await axios.put(
            `${API}/user/purchase-history/update-status/${userId}?statusType=${statusType}&prizeId=${prizeId}&newValue=true`,
            getHeaderJson
        );
    } catch (err) {
        return err.response;
    }
};
// END PURCHASE HISTORY

// TASKS
export const addAutomaticTask = async (userId, options = {}) => {
    // n1
    const { madeBy, content, taskTitle, taskType } = options;

    try {
        return await axios.put(
            `${API}/task/add?userId=${userId}`,
            options,
            getHeaderJson
        );
    } catch (err) {
        return err.response;
    }
};
// END TASKS

// LISTS
// note: requires JWT token
// export const readUserList = async (dispatch, bizId, options = {}) => {
//     let { role, skip, search, token } = options;
//     if(!bizId) return console.log("You should specify the bizId argument");
//     if(!skip) skip = 0;
//     bizId = `&bizId=${bizId}`;

//     const searchQuery = search ? `&search=${search}` : "";
//     const roleQuery = role ? `&role=${role}` : "";
//     // This Loading is activated because is required to
//     // display the current status of loading in RecordedClientsList...
//     setLoadingProgress(dispatch, true);
//     try {
//         const res = await axios.get(`/api/user/list/all?skip=${skip}${roleQuery}${searchQuery}${bizId}`, getHeaderToken(token));
//         setLoadingProgress(dispatch, false);
//         console.log('==ALL USERS UPDATED==');
//         dispatch({ type: 'USER_READ_LIST', payload: res.data.list });
//         return res;
//     } catch (err) {
//         // setLoadingProgress(dispatch, false);
//         return err;
//     }
// };

// export const readHighestScores = async (dispatch, bizId) => {
//     try {
//         const res = await axios.get(`/api/user/list/highest-scores?bizId=${bizId}`, getHeaderJson);
//         dispatch({ type: "HIGHEST_SCORES_READ", payload: res.data})
//     } catch (err) {
//         return err;
//     }
// };

// END LIST

export const countField = async (_id, objToSend) => {
    try {
        return await axios.put(
            `${API}/user/count/field/${_id}?thisRole=${
                objToSend.thisRole || "cliente"
            }`,
            objToSend,
            getHeaderJson
        );
    } catch (err) {
        return err.response;
    }
};

export const getUrlLink = async (code) => {
    try {
        return await axios.get(
            `${API}/user/redirect/url-link?code=${code}`,
            getHeaderJson
        );
    } catch (err) {
        return err.response;
    }
};

// FIELDS
export const removeField = async (userId, fieldName) => {
    const objToSend = { fieldToBeDeleted: fieldName };
    try {
        return await axios.put(
            `${API}/user/field/remove/${userId}`,
            objToSend,
            getHeaderJson
        );
        // dispatch({ type: 'USER_READ', payload: res.data.user });
    } catch (err) {
        return err;
    }
};

// END FIELDS

// IMAGE HANDLING
export const uploadImages = async (formData, options) => {
    const { fileName } = options;
    try {
        return await axios.post(
            `${API}/user/image/upload?fileName=${fileName}`,
            formData,
            getHeaderJson
        );
    } catch (err) {
        return err;
    }
};

export const updateImages = async (_id, bodyToSend) => {
    // bodyToSend: lastUrl, paramArray, customParam
    try {
        return await axios.put(
            `${API}/user/image/update?id=${_id}`,
            bodyToSend,
            getHeaderJson
        );
    } catch (err) {
        return err;
    }
};
// END IMAGE HANDLING

// CHALLENGES AND REWARDS
export const gotUsersInThisChallenge = async (bizId, challengeInd) => {
    try {
        return await axios.get(
            `${API}/user/check/user-challenges?id=${bizId}&challengeInd=${challengeInd}`,
            getHeaderJson
        );
    } catch (err) {
        return err;
    }
};
// END CHALLENGES AND REWARDS

/* COMMENTS
n1:   // Making the logout of the user firstly to make sure the system will not crash with a remaining activate token left by the deleted user
    // Warning: Do not delete users directly from database without logout
    // This does not work!!!
    // logout(dispatch);
*/
