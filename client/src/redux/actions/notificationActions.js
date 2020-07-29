import axios from 'axios';
import { getHeaderJson, getHeaderToken } from '../../utils/server/getHeaders';

// OK sometimes can not load (localhost, production is okay)
export const countPendingNotif = async (userId, options = {}) => {
    const { role, forceCliUser } = options;

    let cliUserQuery = "";
    if(forceCliUser) cliUserQuery = "&forceCliUser=true";

    try {
        return await axios.get(`/api/notification/count-pending-notification?userId=${userId}&role=${role}${cliUserQuery}`, getHeaderJson);
    } catch (err) {
        return err;
    }
}

// OK
// if forceCliUser is true, then a cli-admin will have a cli=user notification's data. Useful for test mode session.
// MOVED TO REQUESTSLIB
// export const readNotifications = async (userId, options = {}) => {
//     const { token, forceCliUser } = options;

//     let cliUserQuery = "";
//     if(forceCliUser) cliUserQuery = "?forceCliUser=true"

//     try {
//         return await axios.get(`/api/notification/read/${userId}${cliUserQuery}`, getHeaderToken(token));
//     } catch (err) {
//         return err;
//     }
// }

// OK
export const sendNotification = async (userId, cardType, options = {}) => {
    const { subtype, token, noToken, content, role, name, senderId } = options;

    const notificationOpts = {
        cardType,
        subtype,
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
        return await axios.put(`/api/notification/send${queryNoToken}${queryCardType}`, notificationOpts, getHeaderToken(token));
    } catch (err) {
        return err;
    }
}

// OK
export const markOneClicked = async (userId, cardId, options = {}) => {
    const { forceCliUser } = options;

    try {
        return await axios.put(`/api/notification/mark-one-clicked/${userId}?cardId=${cardId}`, options, getHeaderJson);
    } catch (err) {
        return err;
    }
}

// OK
export const markAllAsClicked = async (userId, options = {}) => {
    const { forceCliUser } = options;

    try {
        return await axios.put(`/api/notification/mark-all-clicked/${userId}`, options, getHeaderJson);
    } catch (err) {
        return err;
    }
}

// OK
export const markAllAsSeen = async (userId, options = {}) => {
    const { forceCliUser } = options;

    try {
        return await axios.put(`/api/notification/mark-all-seen/${userId}`, options, getHeaderJson);
    } catch (err) {
        return err;
    }
}