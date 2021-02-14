import { addDays } from "../../../utils/dates/dateFns";

export default function didDateExpire(fromThisDate, options = {}) {
    const {
        afterDay = 2, // days after fromThisDate.
        limitRange = 30,
    } = options;

    if (!fromThisDate) return;

    const now = new Date();
    const expiringDate = addDays(new Date(fromThisDate), afterDay);

    const limitDay = limitRange; // become valid again after these quantity of days.
    const limitDate = addDays(new Date(fromThisDate), afterDay + limitDay);

    if (Date.parse(expiringDate) < Date.parse(now) && now <= limitDate) {
        return true;
    }
    return false;
}

// didDateExpire("Fri Aug 21 2020 19:47:26 GMT-0400 (Amazon Standard Time)", { afterDay: 2 });
