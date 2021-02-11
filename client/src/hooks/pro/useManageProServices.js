import { useEffect, useState } from "react";
import getAccurateDate from "../../utils/dates/getAccurateDate";
import useAPI, {
    getNextExpiryDate,
    // removeServices,
} from "../../hooks/api/useAPI";
import { default as checkToday } from "date-fns/isToday";
import { getVar, store } from "../../hooks/storage/useVar";
import { isScheduledDate, addDays } from "../../utils/dates/dateFns";
import { IS_PROD } from "../../config/clientUrl";
import didRunOnce from "../../utils/storage/didRunOnce";
import { sendNotification } from "../../redux/actions/notificationActions";
import usePro from "../../hooks/pro/usePro";
import { useClientAdmin } from "../../hooks/useRoleData";
import useData from "../../hooks/useData";

const getPeriod = (ref) => {
    if (!ref) return;
    const [, , per] = ref.split("-");
    if (per === "A") return "yearly";

    return "monthly";
};

export default function useManageProServices() {
    const [data, setData] = useState({
        isToday: null,
        userId: null,
        isExpired: false,
    });
    const { isToday, userId } = data; // isExpired
    const { bizPlan } = useClientAdmin();

    const [role] = useData(["role"]);

    const { data: nextExpiryDate } = useAPI({
        url: getNextExpiryDate(userId),
        trigger: isToday && userId && role === "cliente-admin",
    });

    const { nextExpiryData: expiryData } = usePro({
        trigger: bizPlan === "gratis" || (nextExpiryDate && userId),
        nextExpiryDate,
        userId,
    });

    const planBr = expiryData && expiryData.nextExPlan;
    const totalMoney = expiryData && expiryData.nextExTotalMoney;
    const totalServ = expiryData && expiryData.nextExTotalServ;
    const orders = expiryData && JSON.stringify(expiryData.nextExOrdersStat);
    const ref = expiryData && expiryData.nextExRef;
    const period = getPeriod(ref);
    const planDays = period === "yearly" ? 365 : 30;

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
        if (nextExpiryDate && nextExpiryDate) {
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

            if (period && needServPreExpiryAlert && !alreadyNearNotified) {
                sendNotification(userId, "pro", {
                    role: "cliente-admin",
                    subtype: "proNearExpiryDate",
                    nT: true,
                    content: `totalMoney:${totalMoney};period:${period};ref:${ref};totalServ:${totalServ};planBr:${planBr};orders:${orders};expiryDate:${nextExpiryDate};planDays:${planDays};`,
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
                if (
                    period &&
                    needServExpiredDateAlert &&
                    !alreadyExpiryNotified
                ) {
                    sendNotification(userId, "pro", {
                        role: "cliente-admin",
                        subtype: "proExpiredDate",
                        nT: true,
                        content: `totalMoney:${totalMoney};period:${period};ref:${ref};totalServ:${totalServ};planBr:${planBr};orders:${orders};expiryDate:${nextExpiryDate};planDays:${planDays};`,
                    });
                }
            }
        }
    };

    useEffect(() => {
        checkForExpiryServices();
        // eslint-disable-next-line
    }, [nextExpiryDate, expiryData]);

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

const { data: removalRes } = useAPI({
    method: "delete",
    url: removeServices(userId),
    trigger: nextExpiryDate && isExpired,
    params: { nextExpiryDate },
});


*/
