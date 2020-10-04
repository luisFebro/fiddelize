import { addDays } from "../../utils/dates/dateFns";
import getDiffDays from "../../utils/dates/getDiffDays";

export default function getDatesCountdown(endDate, options = {}) {
    if (!endDate) return 0;
    const { deadline = 30 } = options;

    const targetDate = addDays(new Date(endDate), deadline);
    const res = getDiffDays(targetDate);

    return res;
}

// const thisRes = getDatesCountdown("2020-10-03T05:36:33.092Z");
// console.log("thisRes", thisRes);
