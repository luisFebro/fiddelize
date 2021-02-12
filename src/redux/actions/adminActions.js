import axios from "axios";
import { getHeaderJson, getHeaderToken } from "../../utils/server/getHeaders";
import { getBodyRequest } from "../../utils/server/getBodyRequest";
import { setLoadingProgress } from "./globalActions";
import { API } from "../../config/api";
// naming structure: action > type > speficification e.g action: GET_MODAL_BLUE / func: getModalBlue

////////////////////////////////////////////////////////////////////
// readAdmin moved to userActions userActions as readCentralAdmin //
////////////////////////////////////////////////////////////////////

export const updateAdmin = async (dispatch, bodyToSend) => {
    try {
        return await axios.put(`${API}/admin`, bodyToSend, getHeaderJson);
    } catch (err) {
        return err.response;
    }
};

export const updateConfig = async (dispatch, objToUpdate) => {
    try {
        const res = await axios.put(
            `${API}/admin/config`,
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
            `${API}/admin/business-info/update`,
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
            `${API}/database/db-from-models/list/${securityObj.adminId}?modelName=${model}&thisRole=cliente-admin`,
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
            `${API}/admin/verification-pass/${bizId}`,
            getHeaderJson
        );
        return res;
    } catch (err) {
        return err.response;
    }
};

export const checkVerificationPass = async (dispatch, objToSend) => {
    // L
    setLoadingProgress(dispatch, true);
    try {
        const res = await axios.post(
            `${API}/admin/verification-pass`,
            objToSend,
            getHeaderJson
        );
        setLoadingProgress(dispatch, false);
        return res;
    } catch (err) {
        setLoadingProgress(dispatch, false);
        return err.response;
    }
};

// export const countAppDownloads = async (dispatch, dataToSend) => {
//     try {
//         await axios.put(`${API}/admin/app/downloads`, dataToSend, getHeaderJson);
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
        const res = await axios.get(`${API}/admin/list/staff-with-bookings?skip=${docsToSkip}`, getHeaderJson);
        return res;
    } catch (err) {
        return err.response;
    }
};

// END STAFF BOOKING

// SERVICES CRUD
export const createService = async (dispatch, adminId, bodyToSend) => {
    try {
        return await axios.post(`${API}/admin/service/${adminId}`, bodyToSend, getHeaderJson);
    } catch (err) {
        return err.response;
    }
};

export const readServicesList = async (dispatch) => {
    try {
        const res = await axios.get(`${API}/admin/service/list/all`, getHeaderJson);
        dispatch({type: 'SERVICES_READ', payload: res.data })
        return res;
    } catch (err) {
        return err.response;
    }
};

export const updateService = async (dispatch, adminId, itemId, bodyToSend) => {
    try {
        return await axios.put(`${API}/admin/service/${adminId}?serviceId=${itemId}`, bodyToSend, getHeaderJson);
    } catch (err) {
        return err.response;
    }
};

export const deleteService = async (dispatch, adminId, serviceId) => {
    try {
        return await axios.delete(`${API}/admin/service/${adminId}?serviceId=${serviceId}`, getHeaderJson);
    } catch (err) {
        return err.response;
    }
};
// END SERVICES CRUD
 */
