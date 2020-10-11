import React, { useEffect, useState } from "react";
import getAccurateDate from "../../utils/dates/getAccurateDate";
import useAPI, {
    getNextExpiryDate,
    removeServices,
} from "../../hooks/api/useAPI";
import { default as checkToday } from "date-fns/isToday";
import { getVar, store } from "../../hooks/storage/useVar";
import { isScheduledDate, addDays } from "../../utils/dates/dateFns";
import { IS_PROD } from "../../config/clientUrl";

export default function useManageProServices() {
    const [data, setData] = useState({
        isToday: null,
        userId: null,
        isExpired: false,
    });
    const { isToday, userId, isExpired } = data;
    console.log("isToday", isToday);

    const { data: nextExpiryDate } = useAPI({
        url: getNextExpiryDate(userId),
        trigger: isToday && userId,
    });

    const { data: removalRes } = useAPI({
        method: "delete",
        url: removeServices(userId),
        trigger: nextExpiryDate && isExpired,
        params: { nextExpiryDate },
    });

    useEffect(() => {
        Promise.all([getVar("userId", store.user), getAccurateDate()]).then(
            (values) => {
                const [thisUserId, date] = values;

                setData({
                    isToday: checkToday(date), // internally, this target date compares with Date.now() - the client's date system
                    userId: thisUserId,
                    isExpired: false,
                });
            }
        );
    }, []);

    useEffect(() => {
        if (nextExpiryDate) {
            const isServActive = isScheduledDate(nextExpiryDate);

            if (!isServActive) {
                setData({
                    ...data,
                    isExpired: true,
                });
            }

            const daysBeforeExpiringDate = addDays(new Date(), -5);
            const alreadyNotified = false; // set the nextExpiryDate as the unique id to check alreadyNotified
            if (isScheduledDate(nextExpiryDate) && !alreadyNotified) {
                // notify user about expiration date
            }
        }
    }, [nextExpiryDate]);

    useEffect(() => {
        if (isToday === false && userId) {
            // IS_PROD after testing. fix date redirection will only applied on production env.
            window.location.href = "/conserte-data";
        }
    }, [isToday, userId]);
}

/*ARCHIVES
Using isToday from fns-date instead...
comparison between dates are 15 minutes diferent.
now Sat Oct 10 2020 10:34:37 GMT-0400 (Amazon Standard Time)
fetched Sat Oct 10 2020 10:20:00 GMT-0400 (Amazon Standard Time)
const now = JSON.stringify(new Date().toLocaleDateString());
const fetchedNow = JSON.stringify(date.toLocaleDateString());
*/
