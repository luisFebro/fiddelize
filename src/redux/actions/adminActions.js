import axios from "axios";
import showProgress from "components/loadingIndicators/progress/showProgress";
import { getHeaderJson, getHeaderToken } from "utils/server/getHeaders";
import { ROOT } from "api/root";
// naming structure: action > type > speficification e.g action: GET_MODAL_BLUE / func: getModalBlue

export const updateAdmin = async (dispatch, bodyToSend) => {
    try {
        return await axios.put(`${ROOT}/admin`, bodyToSend, getHeaderJson);
    } catch (err) {
        return err.response;
    }
};

export const updateConfig = async (dispatch, objToUpdate) => {
    try {
        const res = await axios.put(
            `${ROOT}/admin/config`,
            objToUpdate,
            getHeaderJson
        );
        // dispatch({ type: 'UPDATE_BIZ_INFO', payload: objToUpdate });
        return res;
    } catch (err) {
        return err.response;
    }
};

export const updateBusinessInfo = async (dispatch, objToUpdate) => {
    try {
        const res = await axios.put(
            `${ROOT}/admin/business-info/update`,
            objToUpdate,
            getHeaderJson
        );
        dispatch({ type: "UPDATE_BIZ_INFO", payload: objToUpdate });
        return res;
    } catch (err) {
        return err.response;
    }
};

export const readAllDbFromModels = async (dispatch, securityObj, model) => {
    try {
        return await axios.get(
            `${ROOT}/database/db-from-models/list/${securityObj.adminId}?modelName=${model}&thisRole=cliente-admin`,
            getHeaderToken(securityObj.token)
        );
    } catch (err) {
        return err.response;
    }
};

// CLIENT-ADMIN
export const readVerificationPass = async (bizId) => {
    // L
    try {
        const res = await axios.get(
            `${ROOT}/admin/verification-pass/${bizId}`,
            getHeaderJson
        );
        return res;
    } catch (err) {
        return err.response;
    }
};

export const checkVerificationPass = async (dispatch, objToSend) => {
    showProgress("go");
    try {
        const res = await axios.post(
            `${ROOT}/admin/verification-pass`,
            objToSend,
            getHeaderJson
        );
        showProgress("end");
        return res;
    } catch (err) {
        showProgress("end");
        return err.response;
    }
};

// export const countAppDownloads = async (dispatch, dataToSend) => {
//     try {
//         await axios.put(`${ROOT}/admin/app/downloads`, dataToSend, getHeaderJson);
//     } catch (err) {
//         return err.response;
//     }
// };
// END CLIENT ADMIN

/* COMMENTS
n1: LESSON: never use GET METHOD if you want to send an object to backend, even in the case if it is working on Postman.
*/

/* ARCHIVES
// STAFF BOOKING
export const getStaffWithBookingsList = async (dispatch, docsToSkip) => { // L
    // const searchQuery = search ? `&search=${search}` : "";

    try {
        const res = await axios.get(`${ROOT}/admin/list/staff-with-bookings?skip=${docsToSkip}`, getHeaderJson);
        return res;
    } catch (err) {
        return err.response;
    }
};

// END STAFF BOOKING

// SERVICES CRUD
export const createService = async (dispatch, adminId, bodyToSend) => {
    try {
        return await axios.post(`${ROOT}/admin/service/${adminId}`, bodyToSend, getHeaderJson);
    } catch (err) {
        return err.response;
    }
};

export const readServicesList = async (dispatch) => {
    try {
        const res = await axios.get(`${ROOT}/admin/service/list/all`, getHeaderJson);
        dispatch({type: 'SERVICES_READ', payload: res.data })
        return res;
    } catch (err) {
        return err.response;
    }
};

export const updateService = async (dispatch, adminId, itemId, bodyToSend) => {
    try {
        return await axios.put(`${ROOT}/admin/service/${adminId}?serviceId=${itemId}`, bodyToSend, getHeaderJson);
    } catch (err) {
        return err.response;
    }
};

export const deleteService = async (dispatch, adminId, serviceId) => {
    try {
        return await axios.delete(`${ROOT}/admin/service/${adminId}?serviceId=${serviceId}`, getHeaderJson);
    } catch (err) {
        return err.response;
    }
};
// END SERVICES CRUD
 */
