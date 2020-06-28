import axios from 'axios';
import { getHeaderJson, getHeaderToken } from '../../utils/server/getHeaders';

// OK sometimes can not load
export const countPendingNotif = async (userId, options = {}) => {
    const { role } = options;

    try {
        return await axios.get(`/api/notification/count-pending-notification?userId=${userId}&role=${role}`, getHeaderJson);
    } catch (err) {
        return err;
    }
}

// OK
export const readNotifications = async (userId, options = {}) => {
    const { token } = options;

    try {
        return await axios.get(`api/notification/read/${userId}`, getHeaderToken(token));
    } catch (err) {
        return err;
    }
}

// OK
export const sendNotification = async (userId, cardType, options = {}) => {
    const { token, noToken, content, role, name, senderId } = options;

    const notificationOpts = {
        cardType,
        recipient: { id: userId, role, name },
        senderId: senderId ? senderId : userId,
        content,
    }
    let queryNoToken = "";
    let queryCardType = "";
    if(noToken) {
        queryNoToken = "?noToken=true";
        queryCardType = "&cardType=welcome";
    }

    try {
        return await axios.put(`api/notification/send${queryNoToken}${queryCardType}`, notificationOpts, getHeaderToken(token));
    } catch (err) {
        return err;
    }
}

// OK
export const markOneClicked = async (userId, cardId) => {
    try {
        return await axios.put(`api/notification/mark-one-clicked/${userId}?cardId=${cardId}`, getHeaderJson);
    } catch (err) {
        return err;
    }
}

// OK
export const markAllAsClicked = async (userId) => {
    try {
        return await axios.put(`api/notification/mark-all-clicked/${userId}`, getHeaderJson);
    } catch (err) {
        return err;
    }
}

// OK
export const markAllAsSeen = async (userId) => {
    try {
        return await axios.put(`api/notification/mark-all-seen/${userId}`, getHeaderJson);
    } catch (err) {
        return err;
    }
}