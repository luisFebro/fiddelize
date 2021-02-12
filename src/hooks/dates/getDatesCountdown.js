import { addDays } from "../../utils/dates/dateFns";
import getDiffDays from "../../utils/dates/getDiffDays";

export default function getDatesCountdown(endDate, options = {}) {
    if (!endDate) return 0;
    const { addDaysN } = options;
    // for pro services, already adding target plan date on the backend from v 3.5810.4
    const targetDate = addDaysN
        ? addDays(new Date(endDate), addDaysN)
        : endDate;
    const res = getDiffDays(targetDate);

    return res;
}

// const thisRes = getDatesCountdown("2020-10-03T05:36:33.092Z");
// console.log("thisRes", thisRes);
