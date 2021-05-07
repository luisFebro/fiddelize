// import { useEffect, useState } from "react";

// export default function useCountNotif(userId, options = {}) {
//     const {
//         role,
//         bizId,
//         forceCliUser,
//         forceCliMember,
//         trigger = true,
//     } = options;

//     const [count, setCount] = useState(null);

//     const { runName } = useRun();
//     useEffect(() => {
//         let cancel;
//         if (!trigger) return;
//         if (userId || (runName && runName.includes("notificationCount"))) {
//             if (cancel) return;
//             const options = {
//                 role,
//                 forceCliUser,
//                 bizId,
//             };
//             countPendingNotif(userId, options).then((res) => {
//                 // LESSON
//                 if (res.status !== 200)
//                     return console.log("Something wrong with useCountNotif");
//                 setCount(res.data.total);
//                 cancel = true;
//             });
//         }
//         return () => {
//             cancel = true;
//         };
//     }, [userId, runName, trigger]);

//     return count;
// }

// /* COMMENTS
// n1: do not usestatusText !== "OK" because it is not work on mobile.
// */
