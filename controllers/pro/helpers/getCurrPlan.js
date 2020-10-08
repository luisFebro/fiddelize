const getBrPlan = (planCode) => {
    if (planCode === "OU") return "ouro";
    if (planCode === "PR") return "prata";
    if (planCode === "BR") return "bronze";
};

function analysePlanType(bizPlanList) {
    let res = "";
    let goldN = 0;
    let silverN = 0;

    bizPlanList.forEach((serv) => {
        if (serv.plan === "ouro") {
            res = "ouro";
            ++goldN;
        }

        if (serv.plan === "prata") {
            res = "prata";
            ++silverN;
        }
    });

    if (goldN >= silverN) res = "ouro";
    if (goldN < silverN) res = "prata";
    if (goldN === 0 && silverN === 0) res = "bronze";

    return res;
}

const getCurrPlan = (bizPlanList, options = {}) => {
    const { mainRef } = options;

    if (!mainRef) return;

    const [planCode] = mainRef.split("-");
    const currPlan = getBrPlan(planCode);

    if (!bizPlanList) return currPlan;
    if (currPlan === "ouro") return currPlan;

    const analysedRes = analysePlanType(bizPlanList);

    return analysedRes;
};

module.exports = getCurrPlan;
