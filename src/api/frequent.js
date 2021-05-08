import { useState, useEffect, useMemo } from "react";
import { ROOT } from "api/root";
// generic rest APIs which are called more than 5 times and reusable in any component go here.

import getAPI, { sendNotification as sendNotif } from "api";

// readNewData
export const readUser = async (userId, role, select) => {
    const params = {
        userId,
        role,
        select,
    };

    const res = await getAPI({
        url: `${ROOT}/user/read`,
        params,
    }).catch((err) => {
        Promise.reject(err);
    });
    if (!res) return null;

    return res.data;
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
            .then((res) => {
                setData(res.data);
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
    }).catch((err) => {
        Promise.reject(err);
    });
};

export const useUpdateUser = (userId, role, body, options = {}) => {
    const { trigger } = options;

    const thisBody = useMemo(() => body, []);

    useEffect(() => {
        if (!trigger) return;

        const params = {
            userId,
            role,
        };

        getAPI({
            method: "put",
            url: `${ROOT}/user/update`,
            body: thisBody,
            params,
        }).catch(console.log);
    }, [userId, role, thisBody, trigger]);
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
