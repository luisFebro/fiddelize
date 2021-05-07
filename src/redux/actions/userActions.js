import axios from "axios";
import { ROOT } from "api/root"; // ${ROOT}

// PURCHASE HISTORY
// addPurchaseHistory is on requestLib

export const readPurchaseHistory = async (
    _idUser,
    targetPoints,
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
            `${ROOT}/user/list/purchase-history/${_idUser}?targetPoints=${targetPoints}&thisRole=${thisRole}${noResponseQuery}${skipQuery}${limitQuery}${scoreQuery}${prizeDescQuery}${trophyIconQuery}`
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
            `${ROOT}/user/purchase-history/update-status/${userId}?statusType=${statusType}&prizeId=${prizeId}&newValue=true`
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
        return await axios.put(`${ROOT}/task/add?userId=${userId}`, options);
    } catch (err) {
        return err.response;
    }
};
// END TASKS

export const countField = async (_id, objToSend) => {
    try {
        return await axios.put(
            `${ROOT}/user/count/field/${_id}?thisRole=${
                objToSend.thisRole || "cliente"
            }`,
            objToSend
        );
    } catch (err) {
        return err.response;
    }
};

export const getUrlLink = async (code) => {
    try {
        return await axios.get(`${ROOT}/user/redirect/url-link?code=${code}`);
    } catch (err) {
        return err.response;
    }
};

// FIELDS
export const removeField = async (userId, fieldName) => {
    const objToSend = { fieldToBeDeleted: fieldName };
    try {
        return await axios.put(
            `${ROOT}/user/field/remove/${userId}`,
            objToSend
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
            `${ROOT}/user/image/upload?fileName=${fileName}`,
            formData
        );
    } catch (err) {
        return err;
    }
};

export const updateImages = async (_id, bodyToSend) => {
    // bodyToSend: lastUrl, paramArray, customParam
    try {
        return await axios.put(
            `${ROOT}/user/image/update?id=${_id}`,
            bodyToSend
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
            `${ROOT}/user/check/user-challenges?id=${bizId}&challengeInd=${challengeInd}`
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
