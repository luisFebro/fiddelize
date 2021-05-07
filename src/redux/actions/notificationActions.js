import axios from "axios";
import { getHeaderToken } from "utils/server/getHeaders";
import { ROOT } from "api/root"; // ${ROOT}

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

    let queryNoToken = "";
    if (nT) {
        queryNoToken = "?nT=1"; // it is used in auth controller to send notification without user's login with current condition: req.query.nT && req.query.cardType === "welcome"
    }

    const pushNotifData = options;
    const needPushNotif = pushNotifData && pushNotifData.isPushNotif;

    if (needPushNotif) {
        try {
            return await axios.put(
                `${ROOT}/notification/send`,
                pushNotifData,
                getHeaderToken(token)
            );
        } catch (err) {
            return err;
        }
    }

    const notificationOpts = {
        userId, // for authorization
        cardType,
        subtype,
        recipient: { id: userId, role, name },
        senderId: senderId || undefined,
        content,
    };

    try {
        return await axios.put(
            `${ROOT}/notification/send${queryNoToken}`,
            notificationOpts,
            getHeaderToken(token)
        );
    } catch (err) {
        return err;
    }
};

// OK
export const markOneClicked = async (userId, cardId, options = {}) => {
    const { thisRole, updatedBy, cliMemberId } = options;

    let thisRoleQuery = "";
    if (thisRole) thisRoleQuery = `&thisRole=${thisRole}`;

    let updatedByQuery = "";
    if (updatedBy)
        updatedByQuery = `&cliMemberId=${cliMemberId}&updatedBy=${updatedBy}`;

    try {
        return await axios.put(
            `${ROOT}/notification/mark-one-clicked/${userId}?cardId=${cardId}${thisRoleQuery}${updatedByQuery}`,
            options
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
            `${ROOT}/notification/mark-all-clicked/${userId}`,
            options
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
            `${ROOT}/notification/mark-all-seen/${userId}`,
            options
        );
    } catch (err) {
        return err;
    }
};
