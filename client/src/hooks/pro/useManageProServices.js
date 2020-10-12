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
import didRunOnce from "../../utils/storage/didRunOnce";
import { sendNotification } from "../../redux/actions/notificationActions";

/*
MAKE A FUNCTION TO USE THIS AND PASS TO ORDER PAGE TO RENEWAL
const daysLeft = getDatesCountdown(data.planDueDate, {
            deadline: data.periodDays,
        });

async function setAllVars() {
const readyVar = await Promise.all([
setVar({
    orders_clientAdmin: orders,
}),
setVar({
    totalMoney_clientAdmin: investAmount,
}),
setVar({
    planPeriod_clientAdmin: thisPeriod,
}),
setVar({
    ordersPlan_clientAdmin: thisPlan,
}),
setVar({
    renewalDaysLeft_clientAdmin: daysLeft,
}),
setVar({
    renewalRef_clientAdmin: reference,
}),
]);

setLoadingOrderPage(false);
history.push("/pedidos/admin");
}

setAllVars();

history.push("/pedidos/admin");
 */
export default function useManageProServices() {
    const [data, setData] = useState({
        isToday: null,
        userId: null,
        isExpired: false,
    });
    const { isToday, userId, isExpired } = data;

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

    const checkForExpiryServices = async () => {
        if (nextExpiryDate) {
            const isServActive = isScheduledDate(nextExpiryDate);
            const daysBeforeExpiringDate = addDays(
                new Date(nextExpiryDate),
                -10
            );

            const needServPreExpiryAlert = !isScheduledDate(
                daysBeforeExpiringDate
            );
            const needServExpiredDateAlert = !isScheduledDate(nextExpiryDate);

            const alreadyNearNotified = await didRunOnce(
                "pro_nearExpiryDate",
                daysBeforeExpiringDate,
                { trigger: needServPreExpiryAlert && isServActive }
            );
            if (needServPreExpiryAlert && !alreadyNearNotified) {
                const totalServ = 5;
                const planBr = "ouro";
                const orders = JSON.stringify({});
                const ref = "OU-Q5-1d3423e";

                sendNotification(userId, "pro", {
                    role: "cliente-admin",
                    subtype: "proNearExpiryDate",
                    content: `ref:${ref};totalServices:${totalServ};plan:${planBr};ordersStatement:${orders};expiryDate:${nextExpiryDate};`,
                });
            }

            if (!isServActive) {
                setData((prevData) => ({
                    ...prevData,
                    isExpired: true,
                }));

                const alreadyExpiryNotified = await didRunOnce(
                    "pro_expiredDate",
                    nextExpiryDate
                );
                if (needServExpiredDateAlert && !alreadyExpiryNotified) {
                    sendNotification(userId, "pro", {
                        role: "cliente-admin",
                        subtype: "proExpiredDate",
                        content: ``,
                    });
                }
            }
        }
    };

    useEffect(() => {
        checkForExpiryServices();
    }, [nextExpiryDate]);

    useEffect(() => {
        // fix date redirection will only applied on production env.
        if (isToday === false && userId && IS_PROD) {
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
