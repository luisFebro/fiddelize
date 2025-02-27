// import { useEffect, useState } from "react";
// import { default as checkToday } from "date-fns/isToday";
// import getAccurateDate from "utils/dates/getAccurateDate";
// import useAPI from "api/useAPI";
// import getVar from "init/var";
// import { isScheduledDate, addDays } from "utils/dates/dateFns";
// import didRunOnce from "utils/storage/didRunOnce";
// import { useBizData } from "init";
// import { sendNotification } from "api/frequent";
// import usePro from "./usePro";

// const getPeriod = (ref) => {
//     if (!ref) return false;
//     const [, , per] = ref.split("-");
//     if (per === "A") return "yearly";
//     if (per === "M") return "monthly";

//     return "infinite"; // monthly, yearly, infinity duration. This latter is for services like SMS and upcoming ones like buy games
// };

// export default function useManageProServices() {
//     const [data, setData] = useState({
//         isToday: null,
//         userId: null,
//         isExpired: false,
//     });
//     const { isToday, userId, isExpired } = data;
//     const { bizPlfdsfdan } = useBizData();

//     const proData = usePro({
//         userId,
//         trigger: (isToday && bizfsfdPlan === "gratis") || userId,
//     });

//     const expiryData = proData && proData.nextExpiryData;

//     const planBr = expiryData && expiryData.nextPlan;
//     const totalServ = expiryData && expiryData.nextTotalServ;
//     const totalMoney = expiryData && expiryData.nextInvestAmount;
//     const orders = expiryData && JSON.stringify(expiryData.nextItemList);
//     const ref = expiryData && expiryData.nextReference;
//     const nextExpiryDate = proData && proData.nextExpiryDate;
//     const period = getPeriod(ref);
//     const planDays = period === "yearly" ? 365 : 30;

//     useAPI({
//         method: "delete",
//         url: null,
//         trigger: nextExpiryDate && isExpired,
//         params: { nextExpiryDate },
//     });

//     useEffect(() => {
//         Promise.all([getVar("userId", "user"), getAccurateDate()]).then(
//             (values) => {
//                 const [thisUserId, date] = values;

//                 setData({
//                     isToday: checkToday(date), // internally, this target date compares with Date.now() - the client's date system
//                     userId: thisUserId,
//                     isExpired: false,
//                 });
//             }
//         );
//     }, []);

//     const checkForExpiryServices = async (expiryDate) => {
//         const DAYS_BEFORE_EXPIRE = -5;

//         if (!userId) return;

//         const allRequiredData = {
//             businessId: userId,
//             totalMoney,
//             period,
//             ref,
//             totalServ,
//             planBr,
//             orders,
//             expiryDate,
//             planDays,
//         };

//         if (!nextExpiryDate) return;

//         // date which DAYS_BEFORE_EXPIRE days before expiring plan
//         const daysBeforeExpiringDate = addDays(
//             new Date(nextExpiryDate),
//             DAYS_BEFORE_EXPIRE
//         );

//         const needNearExpirePushNotif = !isScheduledDate(
//             daysBeforeExpiringDate
//         );

//         const areServicesActivated = isScheduledDate(nextExpiryDate);

//         const userAlreadyNotified = await didRunOnce(
//             "pro_nearExpiryDate",
//             daysBeforeExpiringDate,
//             { trigger: needNearExpirePushNotif && areServicesActivated }
//         );

//         const isNearToExpire =
//             period && needNearExpirePushNotif && !userAlreadyNotified;
//         if (isNearToExpire) {
//             const pushNearExpire = getPushNotifData(
//                 "proNearExpiryDate",
//                 allRequiredData
//             );
//             sendNotification(userId, "pro", pushNearExpire);
//         }

//         if (!areServicesActivated) {
//             setData((prevData) => ({
//                 ...prevData,
//                 isExpired: true,
//             }));

//             const alreadyExpiryNotified = await didRunOnce(
//                 "pro_expiredDate",
//                 nextExpiryDate
//             );
//             if (period && !alreadyExpiryNotified) {
//                 const pushExpired = getPushNotifData(
//                     "proExpiredDate",
//                     allRequiredData
//                 );
//                 sendNotification(userId, "pro", pushExpired);
//             }
//         }
//     };

//     useEffect(() => {
//         if (!nextExpiryDate || proData.loading !== false) return;
//         checkForExpiryServices(nextExpiryDate);
//         // eslint-disable-next-line
//     }, [nextExpiryDate, proData.loading]);

//     // useEffect(() => {
//     //     // fix date redirection will only applied on production env.
//     //     if (isToday === false && userId && IS_PROD) {
//     //         window.location.href = "/conserte-data";
//     //     }
//     // }, [isToday, userId]);
// }

// function getPushNotifData(type, data) {
//     const role = "cliente-admin";

//     const defaultNotifCard = {
//         // senderId,
//         cardType: "pro",
//         totalMoney: data.totalMoney,
//         period: data.period,
//         ref: data.ref,
//         totalServ: data.totalServ,
//         planBr: data.planBr,
//         orders: data.orders,
//         expiryDate: data.expiryDate,
//         planDays: data.planDays,
//     };

//     const notifs = {
//         proNearExpiryDate: {
//             role,
//             userId: data.businessId,
//             isPushNotif: true, // only to verify in the backend that need push notif
//             type: "proNearExpiryDate",
//             payload: {
//                 planBr: data.planBr,
//                 totalServ: data.totalServ,
//                 expiryDate: data.expiryDate,
//             },
//             notifCard: {
//                 ...defaultNotifCard,
//                 subtype: "proNearExpiryDate",
//             },
//         },
//         get proExpiredDate() {
//             return {
//                 ...this.proNearExpiryDate,
//                 type: "proExpiredDate",
//                 payload: {
//                     planBr: data.planBr,
//                     totalServ: data.totalServ,
//                 },
//                 notifCard: {
//                     ...defaultNotifCard,
//                     subtype: "proExpiredDate",
//                 },
//             };
//         },
//     };

//     return notifs[type];
// }
// /* ARCHIVES
// Using isToday from fns-date instead...
// comparison between dates are 15 minutes diferent.
// now Sat Oct 10 2020 10:34:37 GMT-0400 (Amazon Standard Time)
// fetched Sat Oct 10 2020 10:20:00 GMT-0400 (Amazon Standard Time)
// const now = JSON.stringify(new Date().toLocaleDateString());
// const fetchedNow = JSON.stringify(date.toLocaleDateString());
// */
