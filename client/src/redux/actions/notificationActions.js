import axios from 'axios';
import { getHeaderJson, getHeaderToken } from '../../utils/server/getHeaders';

// not working properly yet
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

/*
{
    Body To Send
    "recipient": { "id": "5e8b0bfc8c616719b01abc9c", "role": "cliente-admin", "name": "John" },
    "senderId": "5e8b0bfc8c616719b01abc9c",
    "senderName": "Fiddelize",
    "msg": "Hello fuckfdsfdsfds fdsfds fsdadsa dsads adsal",
    "cardType": "system"
}
 */
export const sendNotification = async (userId, bodyToSend, options = {}) => {
    const { token } = options;

    try {
        return await axios.put(`api/notification/send`, bodyToSend, getHeaderToken(token));
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