import React, { useEffect, useState } from "react";
import { sendNotification } from "../../../../redux/actions/notificationActions";
import useGetVar, { setVar } from "../../../../hooks/storage/useVar";
import getGenderLetter from "../../../../utils/biz/getGenderLetter";

export default function useNotifyCliWonChall(recipientId, data = {}) {
    const [sent, setSent] = useState(false);

    const {
        businessId,
        mainReward,
        fullName,
        currChall,
        currScore,
        selfBizLogoImg,
        lastPrizeId,
        maxScore,
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
                rewardScore: maxScore,
                prize: mainReward,
                customerName: fullName,
                currChallN: currChall,
                bizLogo: selfBizLogoImg,
            },
            notifCard: {
                senderId,
                cardType: "challenge",
                subtype: "clientWonChall",
                lastPrizeId,
                rewardScore: maxScore,
                currScore,
                totalPurchasePrize,
                currChall,
                fullName,
                mainReward,
            },
        }),
        // eslint-disable-next-line
        [fullName, lastPrizeId]
    );

    const { data: notifVersion, loading: loadingVar } = useGetVar(key);

    const hasVersion = key && notifVersion;

    // removeVersion now is integrated in a useEffect in the Challenge's confirmation modal when user
    // check for the notification. Then the system remove the version allowing sending notifcation to clli-admin again..

    useEffect(() => {
        let cancel;

        if (trigger && !hasVersion && !loadingVar && !sent) {
            if (cancel || !pushNotifData) return;

            (async () => {
                const gender = await getGenderLetter();

                const finalNotifData = {
                    ...pushNotifData,
                    notifCard: {
                        ...pushNotifData.notifCard,
                        gender,
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
