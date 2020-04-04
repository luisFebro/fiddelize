import axios from 'axios';
import { getHeaderJson, getHeaderToken } from '../../utils/server/getHeaders';
import { getBodyRequest } from '../../utils/server/getBodyRequest';
import { setLoadingProgress } from './globalActions';
// naming structure: action > type > speficification e.g action: GET_MODAL_BLUE / func: getModalBlue


export const readAdmin = async dispatch => {
    try {
        // setLoadingOn(dispatch);
        const res = await axios.get('/api/admin', getHeaderJson);
        console.log('==ADMIN DATA LOADED==');
        dispatch({
            type: 'LOAD_ADMIN',
            payload: res.data
        });
        return res;
        // setLoadingOff(dispatch);
    } catch (err) {
        return err.response;
    }
}

export const updateAdmin = async (dispatch, bodyToSend) => {
    try {
        return await axios.put('/api/admin', bodyToSend, getHeaderJson);
    } catch (err) {
        return err.response;
    }
}

export const updateConfig = async (dispatch, objToUpdate) => {
    try {
        const res = await axios.put(`/api/admin/config`, objToUpdate, getHeaderJson);
        // dispatch({ type: 'UPDATE_BIZ_INFO', payload: objToUpdate });
        return res;
    } catch (err) {
        return err.response;
    }
};

export const updateBusinessInfo = async (dispatch, objToUpdate) => {
    try {
        const res = await axios.put(`/api/admin/business-info/update`, objToUpdate, getHeaderJson);
        dispatch({ type: 'UPDATE_BIZ_INFO', payload: objToUpdate });
        return res;
    } catch (err) {
        return err.response;
    }
};

// STAFF BOOKING
export const getStaffWithBookingsList = async (dispatch, docsToSkip) => { // L
    // const searchQuery = search ? `&search=${search}` : "";

    try {
        const res = await axios.get(`/api/admin/list/staff-with-bookings?skip=${docsToSkip}`, getHeaderJson);
        return res;
    } catch (err) {
        return err.response;
    }
};

// END STAFF BOOKING

// SERVICES CRUD
export const createService = async (dispatch, adminId, bodyToSend) => {
    try {
        return await axios.post(`/api/admin/service/${adminId}`, bodyToSend, getHeaderJson);
    } catch (err) {
        return err.response;
    }
};

export const readServicesList = async (dispatch) => {
    try {
        const res = await axios.get(`/api/admin/service/list/all`, getHeaderJson);
        dispatch({type: 'SERVICES_READ', payload: res.data })
        return res;
    } catch (err) {
        return err.response;
    }
};

export const updateService = async (dispatch, adminId, itemId, bodyToSend) => {
    try {
        return await axios.put(`/api/admin/service/${adminId}?serviceId=${itemId}`, bodyToSend, getHeaderJson);
    } catch (err) {
        return err.response;
    }
};

export const deleteService = async (dispatch, adminId, serviceId) => {
    try {
        return await axios.delete(`/api/admin/service/${adminId}?serviceId=${serviceId}`, getHeaderJson);
    } catch (err) {
        return err.response;
    }
};
// END SERVICES CRUD

export const readAllDbFromModels = async (dispatch, securityObj, model) => {
    try {
        return await axios.get(`/api/database/db-from-models/list/${securityObj.adminId}?modelName=${model}`, getHeaderToken(securityObj.token));
    } catch (err) {
        return err.response;
    }
};

// CLIENT-ADMIN
export const readVerificationPass = async (bizId) => { // L
    try {
        const res = await axios.get(`/api/admin/verification-pass/${bizId}`, getHeaderJson);
        return res;
    } catch (err) {
        return err.response;
    }
};

export const checkVerificationPass = async (dispatch, objToSend) => { // L
    setLoadingProgress(dispatch, true);
    try {
        const res = await axios.post(`/api/admin/verification-pass`, objToSend, getHeaderJson);
        setLoadingProgress(dispatch, false);
        return res;
    } catch (err) {
        setLoadingProgress(dispatch, false);
        return err.response;
    }
};

export const countAppDownloads = async (dispatch, dataToSend) => {
    try {
        await axios.put(`/api/admin/app/downloads`, dataToSend, getHeaderJson);
    } catch (err) {
        return err.response;
    }
};
// END CLIENT ADMIN

/* COMMENTS
n1: LESSON: never use GET METHOD if you want to send an object to backend, even in the case if it is working on Postman.
*/