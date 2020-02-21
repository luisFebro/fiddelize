import axios from 'axios';
import { getHeaderJson } from '../../utils/server/getHeaders';
import {
    setLoadingProgress,
    setCustomLoading,
    setCustomLoading2 } from './globalActions';

export const createBooking = async (dispatch, objToSend, staffId) => { // L
    try {
        return await axios.post(`/api/staff-booking/${staffId}`, objToSend, getHeaderJson);
    } catch (err) {
        return err.response;
    }
};

export const removeBooking = async (dispatch, staffId, itemId) => { // L
    try {
        return await axios.put(`/api/staff-booking/remove/${staffId}?removedId=${itemId}`, getHeaderJson);
    } catch (err) {
        return err.response;
    }
};

export const updateBooking = async (dispatch, objToSend, bookingId) => { // L
    try {
        return await axios.put(`/api/staff-booking/${bookingId}`, objToSend, getHeaderJson);
    } catch (err) {
        return err.response;
    }
};

// update "atrasado" status
export const checkStatusAndUpdateMany = async (dispatch, _staffId) => { // L
    try {
        return await axios.put(`/api/staff-booking/status/${_staffId}`, getHeaderJson);
    } catch (err) {
        return err.response;
    }
};

// LISTS
export const getStaffBookingList = async (dispatch, staffId, docsToSkip, needReadMore = false, search) => {
    needReadMore === true
    ? setCustomLoading(dispatch, true)
    : setLoadingProgress(dispatch, true)

    try {
        const url =`/api/user/staff-booking/list/${staffId}?skip=${docsToSkip}${search ? `&search=${search}` : null}`;
        const res = await axios.get(url, getHeaderJson);
        checkStatusAndUpdateMany(dispatch, staffId);


        needReadMore === true
        ? dispatch({ type: "STAFF_BOOKING_READ_MORE", payload: res.data })
        : dispatch({ type: "STAFF_BOOKING_READ", payload: res.data })

        needReadMore === true
        ? setCustomLoading(dispatch, false)
        : setLoadingProgress(dispatch, false)

        return res;
    } catch (err) {
        needReadMore === true
        ? setCustomLoading(dispatch, false)
        : setLoadingProgress(dispatch, false)
        return err.response;
    }
};

export const getStaffBookingListForAdmin = async (dispatch, staffId, docsToSkip, needReadMore = false, search) => {
    needReadMore !== true
    ? setCustomLoading(dispatch, true)
    : setCustomLoading2(dispatch, true)

    try {
        const url =`/api/user/staff-booking/list/${staffId}?skip=${docsToSkip}${search ? `&search=${search}` : null}`;
        const res = await axios.get(url, getHeaderJson);
        checkStatusAndUpdateMany(dispatch, staffId);

        needReadMore !== true
        ? setCustomLoading(dispatch, false)
        : setCustomLoading2(dispatch, false)

        // State managed in the component

        return res;
    } catch (err) {
        needReadMore !== true
        ? setCustomLoading(dispatch, false)
        : setCustomLoading2(dispatch, false)
        return err.response;
    }
};

// This is fetched directly from component AsyncAutoCompleteSearch
// export const getAllClientsNameFromStaff = async (dispatch, _staffId) => {
//     try {
//         return await axios.get(`/api/staff-booking/list/clients-name-from-staff?staffId=${_staffId}`, getHeaderJson);
//     } catch (err) {
//         return err.response;
//     }
// };