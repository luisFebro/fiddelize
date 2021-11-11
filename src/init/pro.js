import { useBizData } from "init";
import getDatesCountdown from "utils/dates/countdown/getDatesCountdown";

export default function usePro(itemName) {
    const { bizPlanData } = useBizData();

    const handleCredits = () => {
        const creditItems = (bizPlanData && bizPlanData.credits) || {};
        if (creditItems && itemName) return creditItems[itemName];
        return creditItems;
    };

    const finishDate = (bizPlanData && bizPlanData.finishDate) || new Date();

    // functionalities block
    const isFreeTrialExpBlock =
        (bizPlanData && bizPlanData.isFreeTrialExpBlock) || false; // block register of customer for admin apps and all main funcs in members apps
    const isProExpBlock1 = (bizPlanData && bizPlanData.isProExpBlock1) || false; // block register of customer and to know if the a current pro plan is expired
    const isProExpBlock2 = (bizPlanData && bizPlanData.isProExpBlock2) || false; // block all other functionalities after month maintenance (a.k.a RGP - redemption grace period)

    const isNewCliFuncBlocked = isProExpBlock1;
    const isAllAppsFuncBlocked = isFreeTrialExpBlock || isProExpBlock2;

    return {
        isPro: (bizPlanData && bizPlanData.isPro) || false,
        period: (bizPlanData && bizPlanData.period) || null,
        plan: (bizPlanData && bizPlanData.plan) || "gratis",
        credits: handleCredits(), // both free and pro together
        // billing cycle
        startDate: (bizPlanData && bizPlanData.startDate) || new Date(),
        finishDate,
        daysLeft: getDatesCountdown(finishDate),
        mainRef: (bizPlanData && bizPlanData.mainRef) || null,
        // block and expiration
        isFreeTrialExpBlock,
        isProExpBlock1,
        isNewCliFuncBlocked,
        isAllAppsFuncBlocked,
        maintenanceExpDate: bizPlanData && bizPlanData.maintenanceExpDate, // after the expiration of a plan, this will be the second stage - the maintenance month - so that all customers can use at least for 30 days even if they signed up in the last day of the plan
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
