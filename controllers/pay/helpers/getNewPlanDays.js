// reference service SKU: PR-Q2-A-123fd34

const handlePeriodDays = (per) => {
    if (per === "A") return 365;
    if (per === "M") return 30;
};

function getNewPlanDays(reference) {
    const referenceArray = reference && reference.split("-");

    const [, , period] = referenceArray;

    const planDays = handlePeriodDays(period);
}

module.exports = { getNewPlanDays };
