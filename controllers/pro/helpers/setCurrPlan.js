const getReferenceData = require("./getReferenceData");

const getNewService = ({
    isRenewal = false,
    lastRenewalHistory,
    lastCreditEnd,
    periodicityBr,
    currPlan,
    currServ,
    creditEnd,
    usageTimeEnd,
    ref,
}) => {
    const historyObj = {
        ref,
        date: new Date(),
    };

    const infinityCredit = creditEnd === 888;

    return {
        service: currServ,
        plan: currPlan,
        creditEnd:
            lastCreditEnd && !infinityCredit
                ? lastCreditEnd + creditEnd
                : creditEnd,
        usageTimeEnd,
        periodicityBr,
        renewalHistory: isRenewal
            ? [historyObj, ...lastRenewalHistory]
            : [historyObj],
    };
};

const getAllPlanPackage = ({
    allServices,
    plan,
    periodicity,
    currPlan,
    usageTimeEnd,
    ref,
    periodicityBr,
}) => {
    return allServices.map((serv, ind) => {
        const currServ = serv.serviceName;
        const creditEnd = serv ? serv[plan].credit[periodicity] : 888;

        return getNewService({
            isRenewal: false,
            currPlan,
            currServ,
            creditEnd,
            usageTimeEnd,
            ref,
            periodicityBr,
        });
    });
};

const setVirginBizPlanList = ({
    plan,
    periodicity,
    allServices,
    lastOrderServices,
    servicesAlreadyPaid,
    isCurrPlanPackage,
    currPlan,
    usageTimeEnd,
    ref,
    periodicityBr,
}) => {
    let newBizPlanList;

    if (isCurrPlanPackage) {
        newBizPlanList = getAllPlanPackage({
            allServices,
            plan,
            periodicity,
            currPlan,
            usageTimeEnd,
            ref,
            periodicityBr,
        });
    } else {
        const serviceNamesToUpdate = lastOrderServices; // e.g ["Novvos Clientes", "Premmios Clientes"]
        newBizPlanList = serviceNamesToUpdate.map((nameServ) => {
            const currServ = nameServ;
            const foundPricingServ = allServices.find(
                (s) => s.serviceName === currServ
            );
            const creditEnd = foundPricingServ
                ? foundPricingServ[plan].credit[periodicity]
                : 888;

            return getNewService({
                isRenewal: false,
                currPlan,
                currServ,
                creditEnd,
                usageTimeEnd,
                ref,
                periodicityBr,
            });
        });
    }

    console.log("running virgin plan");
    return newBizPlanList;
};

function setCurrPlan(currBizPlanList, orders, options = {}) {
    const { currPlan, usageTimeEnd, ref, allServices } = options;

    const { plan, period: periodicityBr } = getReferenceData(ref);
    const periodicity = periodicityBr === "anual" ? "yearly" : "monthly";

    const lastUserOrder = orders && orders[0].ordersStatement; //{ "Novvos Clientes": { amount: 1, price: 25 } } //orders && orders[0].ordersStatement; //{ "Novvos Clientes": { amount: 1, price: 25 } }//orders && orders[0].ordersStatement; //{ "Novvos Clientes": { amount: 1, price: 25 } } ///orders && orders[0].ordersStatement; ///{ "Envvio Whatsapp": { amount: 1, price: 25 } }///orders && orders[0].ordersStatement;
    const lastOrderServices = lastUserOrder && Object.keys(lastUserOrder);
    const isCurrPlanPackage =
        lastOrderServices && lastOrderServices.includes("currPlan");

    if (currBizPlanList && !currBizPlanList.length)
        return setVirginBizPlanList({
            plan,
            periodicity,
            allServices,
            lastOrderServices,
            isCurrPlanPackage,
            currPlan,
            usageTimeEnd,
            ref,
            periodicityBr,
        });

    // RENEWAL
    const isSingleToPackage =
        isCurrPlanPackage && currBizPlanList.length < allServices.length; // handle case when user buy a single service, and then update to gold or silver.
    if (isSingleToPackage)
        return getAllPlanPackage({
            allServices,
            plan,
            periodicity,
            currPlan,
            usageTimeEnd,
            ref,
            periodicityBr,
        });

    let newBizPlanList;
    if (isCurrPlanPackage) {
        newBizPlanList = currBizPlanList.map((serv) => {
            const currServ = serv.service;
            const foundPricingServ = allServices.find(
                (s) => s.serviceName === currServ
            );
            const creditEnd = foundPricingServ
                ? foundPricingServ[plan].credit[periodicity]
                : 888;

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
                ref,
            });
        });
    } else {
        const serviceNamesToUpdate = lastOrderServices; // e.g ["Novvos Clientes", "Premmios Clientes"]
        newBizPlanList = serviceNamesToUpdate.map((nameServ) => {
            const currServ = nameServ;
            const currDataServ = currBizPlanList.find(
                (serv) => serv.service === nameServ
            );
            const foundPricingServ = allServices.find(
                (s) => s.serviceName === currServ
            );
            const creditEnd = foundPricingServ
                ? foundPricingServ[plan].credit[periodicity]
                : 888;

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
                ref,
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
