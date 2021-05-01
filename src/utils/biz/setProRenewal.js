import { setVar } from "init/var";
import getDatesCountdown from "../../hooks/dates/getDatesCountdown";

export default async function setProRenewal({
    expiryDate,
    orders,
    investAmount,
    planBr,
    ref,
    period,
    isSingleRenewal = false, // update a single service
    // planDays,
}) {
    const daysLeft = getDatesCountdown(expiryDate);

    return await Promise.all([
        setVar({
            orders_clientAdmin: orders,
        }),
        setVar({
            totalMoney_clientAdmin: investAmount,
        }),
        setVar({
            planPeriod_clientAdmin: period, // "yearly" : "monthly"
        }),
        setVar({
            ordersPlan_clientAdmin: planBr,
        }),
        setVar({
            renewalDaysLeft_clientAdmin: daysLeft || 0,
        }),
        setVar({
            renewalRef_clientAdmin: ref,
        }),
        setVar({
            isSingleRenewal_clientAdmin: isSingleRenewal,
        }),
    ]);
}
