const getReferenceData = require("./getReferenceData");

function analysePlanType(orders) {
    let res = "bronze";
    let goldN = 0;
    let silverN = 0;

    orders.forEach((serv) => {
        const { planBr } = getReferenceData(serv.reference);
        const isPaid =
            serv.transactionStatus === "pago" ||
            serv.transactionStatus === "disponível";

        if (planBr === "ouro" && isPaid) {
            res = "ouro";
            ++goldN;
        }

        if (planBr === "prata" && isPaid) {
            res = "prata";
            ++silverN;
        }
    });

    if (goldN >= silverN) res = "ouro";
    if (goldN < silverN) res = "prata";
    if (goldN === 0 && silverN === 0) res = "bronze";

    return res;
}

const getCurrPlan = (orders) => {
    if (!orders) return "bronze";

    return analysePlanType(orders);
};

module.exports = getCurrPlan;
