import { getVar, store } from "../../../../../hooks/storage/useVar";
import getDatesCountdown from "../../../../../hooks/dates/getDatesCountdown";

const checkUltimateRenewal = ({ ordersStatement, bizPlanList }) => {
    if ((bizPlanList && !bizPlanList.length) || !ordersStatement)
        return { res: false };

    const lastOrderServices = ordersStatement && Object.keys(ordersStatement); // only services e.g ["Novvos Clientes, Prêmmios Clientes"]

    let res = false;
    let ultimateDaysLeft;

    bizPlanList.forEach((s) => {
        if (lastOrderServices.includes(s.service)) {
            res = true;
            ultimateDaysLeft = getDatesCountdown(s.usageTimeEnd);
        }
    });

    return { res, ultimateDaysLeft };
};

const handlePeriodDays = (reference) => {
    const referenceArray = reference && reference.split("-");
    const [, , per] = referenceArray;

    if (per === "A") return 365;
    if (per === "M") return 30;
};

const handleDaysLeft = ({ renewalDaysLeft, ultimateDaysLeft }) => {
    if (ultimateDaysLeft) return ultimateDaysLeft;
    return renewalDaysLeft ? Number(renewalDaysLeft) : undefined;
};

export default function handleRenewalDays({
    ordersStatement,
    setRenewalData,
    renewalDaysLeft,
    renewalReference,
    isSingleRenewal,
    reference,
}) {
    getVar("proData", store.request_api_data).then((proData) => {
        const bizPlanList = proData && proData.bizPlanList;
        // for cases when client-admin buys something from the service store and not pass by the front-end system handled by isSingleRenewal or isRenewal
        // Here checkes if the current order statement includes some priorly bought service. This is critical to apply the correct date.
        const {
            res: isUltimateRenewal,
            ultimateDaysLeft,
        } = checkUltimateRenewal({ ordersStatement, bizPlanList });

        const res = {
            newRenewalDaysLeft:
                handleDaysLeft({ renewalDaysLeft, ultimateDaysLeft }) || 0,
            renewalCurrDays:
                renewalReference || isSingleRenewal || isUltimateRenewal
                    ? handlePeriodDays(reference)
                    : undefined,
            renewalReady: true,
        };
        setRenewalData(res);
    });
}
