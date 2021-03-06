import axios from "axios";
import { getHeaderJson, getHeaderToken } from "../../utils/server/getHeaders";
import { API } from "../../config/api"; // ${API}
// OK sometimes can not load (localhost, production is okay)
export const countPendingNotif = async (userId, options = {}) => {
    if (!userId) return;

    const { role, forceCliUser, bizId } = options;

    let cliUserQuery = "";
    if (forceCliUser) cliUserQuery = "&forceCliUser=true";

    let cliMemberQuery = "";
    if (role === "cliente-membro" && bizId) cliMemberQuery = `&bizId=${bizId}`; // bizId so that members can read all admin challanges related notifications

    try {
        return await axios.get(
            `${API}/notification/count-pending-notification?userId=${userId}&role=${
                role || "cliente"
            }${cliUserQuery}${cliMemberQuery}`,
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
        senderId: senderId || undefined,
        content,
    };
    let queryNoToken = "";
    if (nT) {
        queryNoToken = "?nT=1"; // it is used in auth controller to send notification without user's login with current condition: req.query.nT && req.query.cardType === "welcome"
    }

    try {
        return await axios.put(
            `${API}/notification/send${queryNoToken}`,
            notificationOpts,
            getHeaderToken(token)
        );
    } catch (err) {
        return err;
    }
};

// OK
export const markOneClicked = async (userId, cardId, options = {}) => {
    const { forceCliUser, thisRole, updatedBy, cliMemberId } = options;

    let thisRoleQuery = "";
    if (thisRole) thisRoleQuery = `&thisRole=${thisRole}`;

    let updatedByQuery = "";
    if (updatedBy)
        updatedByQuery = `&cliMemberId=${cliMemberId}&updatedBy=${updatedBy}`;

    try {
        return await axios.put(
            `${API}/notification/mark-one-clicked/${userId}?cardId=${cardId}${thisRoleQuery}${updatedByQuery}`,
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
            `${API}/notification/mark-all-clicked/${userId}`,
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
            `${API}/notification/mark-all-seen/${userId}`,
            options,
            getHeaderJson
        );
    } catch (err) {
        return err;
    }
};
