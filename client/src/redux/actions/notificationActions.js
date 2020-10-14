import axios from "axios";
import { getHeaderJson, getHeaderToken } from "../../utils/server/getHeaders";

// OK sometimes can not load (localhost, production is okay)
export const countPendingNotif = async (userId, options = {}) => {
    const { role, forceCliUser } = options;

    let cliUserQuery = "";
    if (forceCliUser) cliUserQuery = "&forceCliUser=true";

    try {
        return await axios.get(
            `/api/notification/count-pending-notification?userId=${userId}&role=${role}${cliUserQuery}`,
            getHeaderJson
        );
    } catch (err) {
        return err;
    }
};

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
    const { subtype, token, nT, content, role, name, senderId } = options;

    const notificationOpts = {
        userId, // for authorization
        cardType,
        subtype,
        recipient: { id: userId, role, name },
        senderId: senderId ? senderId : undefined,
        content,
    };
    let queryNoToken = "";
    if (nT) {
        queryNoToken = "?nT=1"; // it is used in auth controller to send notification without user's login with current condition: req.query.nT && req.query.cardType === "welcome"
    }

    try {
        return await axios.put(
            `/api/notification/send${queryNoToken}`,
            notificationOpts,
            getHeaderToken(token)
        );
    } catch (err) {
        return err;
    }
};

// OK
export const markOneClicked = async (userId, cardId, options = {}) => {
    const { forceCliUser } = options;

    try {
        return await axios.put(
            `/api/notification/mark-one-clicked/${userId}?cardId=${cardId}`,
            options,
            getHeaderJson
        );
    } catch (err) {
        return err;
    }
};

// OK
export const markAllAsClicked = async (userId, options = {}) => {
    const { forceCliUser } = options;

    try {
        return await axios.put(
            `/api/notification/mark-all-clicked/${userId}`,
            options,
            getHeaderJson
        );
    } catch (err) {
        return err;
    }
};

// OK
export const markAllAsSeen = async (userId, options = {}) => {
    const { forceCliUser } = options;

    try {
        return await axios.put(
            `/api/notification/mark-all-seen/${userId}`,
            options,
            getHeaderJson
        );
    } catch (err) {
        return err;
    }
};
