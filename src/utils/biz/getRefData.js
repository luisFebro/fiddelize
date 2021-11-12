// ref code e.g OU-Q3-A-PL-L7F8D3X-P
export default function getRefData(ref) {
    if (!ref) return null;
    // codeId never has "-" to avoid any issue with splitting
    const [planCode, qttCode, period, range, codeId, isPro] = ref.split("-");

    return {
        ref,
        planBr: getBrPlan(planCode),
        periodicityBr: getBrPeriod(period),
        plan: getPlan(planCode),
        periodicity: getPeriod(period),
        qtt: getQtt(qttCode), // not used anywhere... UPDATE: use to get total for push notif for pro-near-exp
        codeId,
        planRange: getPlanRange(range),
        isPro: isPro === "P",
    };
}

function getBrPlan(planCode) {
    if (planCode === "OU") return "ouro";
    if (planCode === "PR") return "prata";
    if (planCode === "BR") return "bronze";
    return "";
}

function getPlan(planCode) {
    if (planCode === "OU") return "gold";
    if (planCode === "PR") return "silver";
    if (planCode === "BR") return "bronze";
    return "";
}

function getBrPeriod(code) {
    if (code === "A") return "anual";
    if (code === "M") return "mensal";
    if (code === "I") return "infinito"; // It means infinite which has the concept of buy-once-use-as-long-as-you-want-or-have-credits
    return "";
}

function getPeriod(code) {
    if (code === "A") return "yearly";
    if (code === "M") return "monthly";
    if (code === "I") return "infinite";
}

function getQtt(qttCode) {
    if (!qttCode) return null;
    return Number(qttCode.slice(1));
}

function getPlanRange(range) {
    if (range === "PL") return "fullPlan"; // any main service
    return "selected"; // SE any selected extra service
}
