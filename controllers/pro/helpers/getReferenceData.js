const getBrPlan = (planCode) => {
    if (planCode === "OU") return "ouro";
    if (planCode === "PR") return "prata";
    if (planCode === "BR") return "bronze";
};

const getPlan = (planCode) => {
    if (planCode === "OU") return "gold";
    if (planCode === "PR") return "silver";
    if (planCode === "BR") return "bronze";
};

const getBrPeriod = (code) => {
    if (code === "A") return "anual";
    if (code === "M") return "mensal";
};

const getReferenceData = (ref) => {
    const [planCode, qtt, period] = ref.split("-");

    return {
        planBr: getBrPlan(planCode),
        period: getBrPeriod(period),
        plan: getPlan(planCode),
    };
};

module.exports = getReferenceData;
