import useData, { useBizData } from "init";
import getDatesCountdown from "utils/dates/countdown/getDatesCountdown";
import getRefData from "utils/biz/getRefData";

export default function usePro(itemName) {
    const { role } = useData();
    const { bizPlanData } = useBizData();
    const isCliMember = role === "cliente-membro";

    // functionalities block
    const isFreeTrialExpBlock =
        (bizPlanData && bizPlanData.isFreeTrialExpBlock) || false; // block register of customer for admin apps and all main funcs in members apps
    const isProExpBlock2 = (bizPlanData && bizPlanData.isProExpBlock2) || false; // block all other functionalities after month maintenance (a.k.a RGP - redemption grace period)
    const isProExpBlock1 =
        (bizPlanData && bizPlanData.isProExpBlock1 && !isProExpBlock2) || false; // block register of customer and to know if the a current pro plan is expired
    const maintenanceExpDate = bizPlanData && bizPlanData.maintenanceExpDate;

    // while isProExpBlock1 is true, keep the register clients blocked, not considering level 2 truthness
    const isMainRegisterFuncBlocked =
        (bizPlanData && bizPlanData.isProExpBlock1) || isFreeTrialExpBlock;

    if (isCliMember) {
        return {
            isProExpBlock2,
            isProExpBlock1,
            isMainRegisterFuncBlocked,
        };
    }

    const handleCredits = () => {
        const creditItems = (bizPlanData && bizPlanData.credits) || {};
        if (creditItems && itemName) return creditItems[itemName];
        return creditItems;
    };

    const finishDate = (bizPlanData && bizPlanData.finishDate) || new Date();

    // when in the level 1 of block, the prior plan should still appear but alongside with a maintenance month badge
    const mainRef = (bizPlanData && bizPlanData.mainRef) || null;
    return {
        isPro: isProExpBlock1
            ? true
            : (bizPlanData && bizPlanData.isPro) || false,
        plan: isProExpBlock1
            ? getRefData(mainRef).planBr
            : (bizPlanData && bizPlanData.plan) || "gratis",
        // in ProRenewalBtn - force the plan to be from mainItemList since after isProExpBlock2 is true - the last func block - the plan is officially free, but we still have all the renewal btns that will have wrongly a "free" renewal in ther order page
        planMainItemList: isProExpBlock2 && getRefData(mainRef).planBr,
        period: isProExpBlock1
            ? getRefData(mainRef).periodicityBr
            : (bizPlanData && bizPlanData.period) || null,
        periodMainItemList: isProExpBlock2 && getRefData(mainRef).periodicity,
        periodEn: isProExpBlock1 && getRefData(mainRef).periodicity,
        credits: handleCredits(), // both free and pro together
        // billing cycle
        startDate: (bizPlanData && bizPlanData.startDate) || new Date(),
        finishDate,
        // maintenanceExpDate is automatically set to null when the plan is renewed
        daysLeft: getDatesCountdown(maintenanceExpDate || finishDate),
        mainRef,
        mainItemList: bizPlanData && bizPlanData.mainItemList, // only available via init request if isProExpBlock1 is true for renewal
        // block and expiration
        isFreeTrialExpBlock,
        isProExpBlock1,
        isProExpBlock2,
        isMainRegisterFuncBlocked,
        maintenanceExpDate, // after the expiration of a plan, this will be the second stage - the maintenance month - so that all customers can use at least for 30 days even if they signed up in the last day of the plan
    };
}

/* PAYLOAD EXAMPLE
    credits: {Novvos Clientes: 5000, Connecta Membros: 5, sms: 100}
    finishDate: "2023-10-26T00:31:06.632Z"
    isPro: true
    period: "anual"
    plan: "prata"
    startDate: "2021-10-26T00:25:41.695Z"
 */
