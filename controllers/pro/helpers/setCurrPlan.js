const getReferenceData = require("./getReferenceData");

// HANDLING CREDITS
const handleCredits = ({
    currServ,
    servObj,
    currPaidOrder,
    plan,
    periodicity,
}) => {
    if (currServ === "Novvos Membros") {
        const customCredit =
            currPaidOrder.ordersStatement[currServ].totalPackage;
        return customCredit; // handling custom credits added by user like novvos membros which is not in the Pricing DB and thus avoiding adding 888
    }
    return servObj ? servObj[plan].credit[periodicity] : 888;
};

const handleCreditEnd = ({
    currServ,
    foundServicePriceDoc,
    lastUserOrder,
    isServiceSoldByPackage,
    plan,
    periodicity,
    currPaidOrder,
}) => {
    if (lastUserOrder && isServiceSoldByPackage) {
        return lastUserOrder[currServ].amount;
    }

    return handleCredits({
        currServ,
        servObj: foundServicePriceDoc,
        currPaidOrder,
        plan,
        periodicity,
    });
};

// END HANDLING CREDITS

const getNewService = ({
    isRenewal = false,
    lastRenewalHistory,
    lastCreditEnd,
    periodicityBr,
    currPlan,
    currServ,
    creditEnd,
    usageTimeEnd,
    reference,
}) => {
    const historyObj = {
        ref: reference,
        date: new Date(),
    };

    const infinityCredit = creditEnd === 888;

    const gotLastCredits = lastCreditEnd && !infinityCredit;

    return {
        service: currServ,
        plan: currPlan,
        creditEnd: gotLastCredits ? lastCreditEnd + creditEnd : creditEnd,
        usageTimeEnd,
        periodicityBr,
        renewalHistory: isRenewal
            ? [historyObj, ...lastRenewalHistory]
            : [historyObj],
    };
};

const getAllPlanPackage = ({
    allPricing,
    plan,
    periodicity,
    currPlan,
    usageTimeEnd,
    reference,
    periodicityBr,
    currPaidOrder,
}) => {
    return allPricing.map((serv, ind) => {
        const currServ = serv.serviceName;
        const creditEnd = handleCredits({
            currServ,
            servObj: serv,
            currPaidOrder,
            plan,
            periodicity,
        });

        return getNewService({
            isRenewal: false,
            currPlan,
            currServ,
            creditEnd,
            usageTimeEnd,
            reference,
            periodicityBr,
        });
    });
};

const setVirginBizPlanList = ({
    plan,
    periodicity,
    allPricing,
    lastOrderServices,
    servicesAlreadyPaid,
    isCurrFullPremium,
    currPlan,
    usageTimeEnd,
    reference,
    periodicityBr,
    currPaidOrder,
}) => {
    let newBizPlanList;

    if (isCurrFullPremium) {
        newBizPlanList = getAllPlanPackage({
            allPricing,
            plan,
            periodicity,
            currPlan,
            usageTimeEnd,
            reference,
            periodicityBr,
            currPaidOrder,
        });
    } else {
        const serviceNamesToUpdate = lastOrderServices; // e.g ["Novvos Clientes", "Premmios Clientes"]
        newBizPlanList = serviceNamesToUpdate.map((nameServ) => {
            const currServ = nameServ;
            const foundServicePriceDoc = allPricing.find(
                (s) => s.serviceName === currServ
            );
            const creditEnd = handleCredits({
                currServ,
                servObj: foundServicePriceDoc,
                currPaidOrder,
                plan,
                periodicity,
            });

            return getNewService({
                isRenewal: false,
                currPlan,
                currServ,
                creditEnd,
                usageTimeEnd,
                reference,
                periodicityBr,
            });
        });
    }

    console.log("running virgin plan");
    return newBizPlanList;
};

function setCurrPlan(currBizPlanList, orders, options = {}) {
    const { currPlan, usageTimeEnd, reference, allPricing } = options;

    const currPaidOrder = orders.find((s) => {
        return s.reference === reference && s.transactionStatus === "pago";
    });

    const { plan, period: periodicityBr } = getReferenceData(reference);
    const periodicity = periodicityBr === "anual" ? "yearly" : "monthly";

    const lastUserOrder = orders && orders[0].ordersStatement; //{ "Novvos Clientes": { amount: 1, price: 25 } } //orders && orders[0].ordersStatement; //{ "Novvos Clientes": { amount: 1, price: 25 } }//orders && orders[0].ordersStatement; //{ "Novvos Clientes": { amount: 1, price: 25 } } ///orders && orders[0].ordersStatement; ///{ "Envvio Whatsapp": { amount: 1, price: 25 } }///orders && orders[0].ordersStatement;
    const lastOrderServices = lastUserOrder && Object.keys(lastUserOrder);
    const isCurrFullPremium =
        lastOrderServices && lastOrderServices.includes("currPlan");

    if (currBizPlanList && !currBizPlanList.length)
        return setVirginBizPlanList({
            plan,
            periodicity,
            allPricing,
            lastOrderServices,
            isCurrFullPremium,
            currPlan,
            usageTimeEnd,
            reference,
            periodicityBr,
            currPaidOrder,
        });

    // RENEWAL
    // Warning for future update: This override previous services bought like a package (e.g Novvos CLientes).
    // Soon fix it when necessary.
    const isSingleToPackage =
        isCurrFullPremium && currBizPlanList.length < allPricing.length; // handle case when user buy a single service, and then update to gold or silver.
    if (isSingleToPackage)
        return getAllPlanPackage({
            allPricing,
            plan,
            periodicity,
            currPlan,
            usageTimeEnd,
            reference,
            periodicityBr,
            currPaidOrder,
        });

    let newBizPlanList;
    if (isCurrFullPremium) {
        newBizPlanList = currBizPlanList.map((serv) => {
            const currServ = serv.service;

            const foundServicePriceDoc = allPricing.find(
                (s) => s.serviceName === currServ
            );

            const creditEnd = handleCredits({
                currServ,
                servObj: foundServicePriceDoc,
                currPaidOrder,
                plan,
                periodicity,
            });

            const lastRenewalHistory = serv ? serv.renewalHistory : [];
            const lastCreditEnd = serv ? serv.creditEnd : 0;
            return getNewService({
                isRenewal: true,
                lastRenewalHistory,
                lastCreditEnd,
                currPlan,
                currServ,
                creditEnd,
                usageTimeEnd,
                reference,
            });
        });
    } else {
        const serviceNamesToUpdate = lastOrderServices; // e.g ["Novvos Clientes", "Prêmmios Clientes"]
        newBizPlanList = serviceNamesToUpdate.map((nameServ) => {
            const currServ = nameServ;
            const currDataServ = currBizPlanList.find(
                (serv) => serv.service === nameServ
            );
            const foundServicePriceDoc = allPricing.find(
                (s) => s.serviceName === currServ
            );

            const isServiceSoldByPackage =
                foundServicePriceDoc && foundServicePriceDoc.isPackage;
            const creditEnd = handleCreditEnd({
                currServ,
                foundServicePriceDoc,
                isServiceSoldByPackage,
                lastUserOrder,
                plan,
                periodicity,
                currPaidOrder,
            });

            const lastRenewalHistory = currDataServ
                ? currDataServ.renewalHistory
                : [];
            const lastCreditEnd = currDataServ ? currDataServ.creditEnd : 0;
            return getNewService({
                isRenewal: true,
                lastRenewalHistory,
                lastCreditEnd,
                currPlan,
                currServ,
                creditEnd,
                usageTimeEnd,
                reference,
                periodicityBr,
            });
        });

        const finalMatch = currBizPlanList.map((s) => {
            const needReplace =
                lastOrderServices && lastOrderServices.includes(s.service);
            if (needReplace) {
                return newBizPlanList.find(
                    (thisServ) => thisServ.service === s.service
                );
            }

            return s;
        });

        newBizPlanList = finalMatch;
    }

    return newBizPlanList;
}

/*
[
  ...currBizPlanList,
  ...newBizPlanList,
]
 */

module.exports = setCurrPlan;
