import React, { useEffect, useState } from "react";
import { sendNotification } from "../../../../redux/actions/notificationActions";
import useData from "init";
import getVar, { setVar } from "init/var";

export default function useNotifyCliWonChall(recipientId, data = {}) {
    const [sent, setSent] = useState(false);

    const {
        businessId,
        mainReward,
        fullName,
        currChall,
        currPoints,
        bizLogo,
        lastPrizeId,
        targetPoints,
        totalPurchasePrize,
        senderId,
        // trigger
        userIdLoading,
        userBeatChallenge,
    } = data;

    const key = "alreadyAlertChallenge";
    const value = currChall;
    const trigger = Boolean(userBeatChallenge && lastPrizeId && !userIdLoading);

    const cardType = "challenge";

    const pushNotifData = React.useMemo(
        () => ({
            isPushNotif: true, // only to verify in the backend that need push notif
            type: "clientWonChall",
            role: "cliente-admin",
            userId: businessId,
            payload: {
                role: "cliente-admin",
                targetPoints,
                prize: mainReward,
                customerName: fullName,
                currChallN: currChall,
                bizLogo,
            },
            notifCard: {
                senderId,
                cardType: "challenge",
                subtype: "clientWonChall",
                lastPrizeId,
                targetPoints,
                currPoints,
                totalPurchasePrize,
                currChall,
                fullName,
                mainReward,
            },
        }),
        // eslint-disable-next-line
        [fullName, lastPrizeId]
    );

    const [notifVersion] = useData([key]);
    const loadingVar = notifVersion !== "...";

    const hasVersion = key && notifVersion;

    useEffect(() => {
        let cancel;

        if (trigger && !hasVersion && !loadingVar && !sent) {
            if (cancel || !pushNotifData) return;

            (async () => {
                const sexLetter = await getVar("sexLetter", "user");

                const finalNotifData = {
                    ...pushNotifData,
                    notifCard: {
                        ...pushNotifData.notifCard,
                        gender: sexLetter,
                    },
                };

                await sendNotification(recipientId, cardType, finalNotifData);
                setSent(true);
                if (key) setVar({ [key]: value });
            })();
        }
        return () => {
            cancel = true;
        };
    }, [trigger, hasVersion, loadingVar, sent, pushNotifData]);

    return sent;
}
