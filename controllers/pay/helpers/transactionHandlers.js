exports.handleModifiedOrders = ({
    targetOr,
    isCurrRenewal,
    mainRef,
    isPaid,
    thisDueDate,
    getPaymentMethod,
    paymentMethodCode,
    currStatus,
    lastEventDate,
}) => {
    const priorRef = targetOr.renewal && targetOr.renewal.priorRef;
    const condition = isCurrRenewal
        ? targetOr.reference === mainRef || targetOr.reference === priorRef
        : targetOr.reference === mainRef;
    if (condition) {
        if (isPaid) {
            const { renewal } = targetOr;
            if (mainRef === (renewal && renewal.currRef)) {
                targetOr.renewal.isPaid = true;
            }
        }

        if (isPaid && targetOr.reference === priorRef) {
            targetOr.planDueDate = undefined; // make the last card required to be renewal with no date to expire it.
        } else {
            targetOr.planDueDate = thisDueDate;
        }

        targetOr.paymentMethod = getPaymentMethod(paymentMethodCode);
        targetOr.transactionStatus = currStatus;
        targetOr.updatedAt = lastEventDate;

        return targetOr;
    }

    return targetOr;
};

exports.handleProPlan = ({
    data2,
    getCurrPlan,
    currBizPlanList,
    mainRef,
    setCurrPlan,
    orders,
    allServices,
    thisDueDate,
}) => {
    const currPlan = getCurrPlan(currBizPlanList, { mainRef });
    data2.clientAdminData.bizPlan = currPlan;
    data2.clientAdminData.bizPlanList = setCurrPlan(currBizPlanList, orders, {
        allServices,
        currPlan,
        usageTimeEnd: thisDueDate,
        ref: mainRef,
    });
};
