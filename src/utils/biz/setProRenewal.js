import { setVars } from "init/var";
import getDatesCountdown from "utils/dates/countdown/getDatesCountdown";

export default async function setProRenewal({
    expiryDate,
    orderList,
    investAmount,
    planBr,
    ref,
    period,
    isSingleRenewal = false, // update a single service
    // planDays,
}) {
    const daysLeft = getDatesCountdown(expiryDate);

    return await setVars({
        orders_clientAdmin: orderList,
        staff: cardsData.staff,
        totalMoney_clientAdmin: investAmount,
        planPeriod_clientAdmin: period, // "yearly" : "monthly"
        ordersPlan_clientAdmin: planBr,
        renewalDaysLeft_clientAdmin: daysLeft || 0,
        renewalRef_clientAdmin: ref,
        isSingleRenewal_clientAdmin: isSingleRenewal,
    });
}
