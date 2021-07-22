import { useState, useEffect } from "react";
import { ROOT } from "api/root";
// generic rest APIs which are called more than 5 times and reusable in any component go here.

import getAPI, { pushElemToField as thisPushElemToField } from "api";

// readNewData
export const readUser = async (userId, role, select) => {
    const params = {
        userId,
        role,
        select,
    };

    return await getAPI({
        url: `${ROOT}/user/read`,
        params,
    });
};

export const useReadUser = (userId, role, select, options = {}) => {
    const { trigger = true } = options;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!trigger) return;

        const params = {
            userId,
            role,
            select,
        };

        getAPI({
            url: `${ROOT}/user/read`,
            params,
        })
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, [userId, role, select, trigger]);

    return { data, loading };
};

export const updateUser = async (userId, role, body) => {
    const params = {
        userId,
        role,
    };

    await getAPI({
        method: "put",
        url: `${ROOT}/user/update`,
        body,
        params,
    });
};

export const pushElemToField = async (userId, role, field, options = {}) => {
    const { firstIn = false } = options;

    const body = {
        userId,
        role,
        field,
        firstIn,
    };

    await getAPI({
        method: "put",
        url: thisPushElemToField(),
        body,
    });
};

// WARNING: sending notifications should prioritarily happen in the backend. This method is to maintain prior frontend implementation
export const sendNotification = async (userId, cardType, options = {}) => {
    const { subtype, nT, content, role, name, senderId } = options;

    const pushNotifData = options;
    const needPushNotif = pushNotifData && pushNotifData.isPushNotif;

    if (needPushNotif) {
        return await getAPI({
            method: "put",
            url: `${ROOT}/notification/send`,
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
        url: `${ROOT}/notification/send`,
        fullCatch: true,
        params: {
            nT: nT ? 1 : undefined,
        },
        body: notificationOpts,
    });
};
