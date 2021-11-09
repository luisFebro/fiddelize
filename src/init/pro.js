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
