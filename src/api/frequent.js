// generic rest APIs which are called more than 5 times and reusable in any component go here.

import getAPI, {
    readUser as readThisUser,
    updateUser as updateThisUser,
    sendNotification as sendNotif,
} from "api";

// readNewData
export const readUser = async (userId, options = {}) => {
    const { role } = options;
    let { select } = options;

    const isCliAdmin = role === "cliente-admin";
    select = isCliAdmin ? "cliAdminSelect" : select;

    const params = {
        select,
        clientAdminRequest: isCliAdmin ? true : undefined,
    };

    const noResponse = Boolean(!select);

    return await getAPI({
        url: readThisUser(userId, role, noResponse),
        params,
    });

    // option to use uify here
};

// NEW METHOD: updateData (instead of updateUser) to set a new value and read and update whatever was selected to updated with UIFY
// use it in challenge-prize/List.js, ClientScorePanel and places which are required an instant update in both DB and UI.
// pass uify as options to update ui

export const updateUser = async (userId, body, options = {}) => {
    // selectKeys: only fields to update and be returned in the api response
    const { selectKeys, noResponse, thisRole } = options;

    const params = {
        selectKeys,
    };

    return await getAPI({
        method: "put",
        url: updateThisUser(userId, thisRole, noResponse),
        body,
        params,
    });
};

// WARNING: sending notifications should prioritarily happen in the backend. This method is to maintain prior frontend implement
export const sendNotification = async (userId, cardType, options = {}) => {
    const { subtype, nT, content, role, name, senderId } = options;

    const pushNotifData = options;
    const needPushNotif = pushNotifData && pushNotifData.isPushNotif;

    if (needPushNotif) {
        return await getAPI({
            method: "put",
            url: sendNotif(),
            body: pushNotifData,
            fullCatch: true,
        });
    }

    const notificationOpts = {
        userId, // for authorization
        cardType,
        subtype,
        recipient: { id: userId, role, name },
        senderId: senderId || undefined,
        content,
    };

    return await getAPI({
        method: "put",
        url: sendNotif(),
        fullCatch: true,
        params: {
            nT: nT ? 1 : undefined,
        },
        body: notificationOpts,
    });
};
