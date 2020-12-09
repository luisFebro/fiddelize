const setCurrPlan = require("../../pro/helpers/setCurrPlan");
const getCurrPlan = require("../../pro/helpers/getCurrPlan");

exports.handleProSMSCredits = ({ adminData, isSMS }) => {
    const priorCredits = adminData.clientAdminData.smsBalance;
    const newCredits =
        isSMS.ordersStatement &&
        isSMS.ordersStatement.sms &&
        isSMS.ordersStatement.sms.amount;

    return priorCredits + newCredits;
};

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
    adminData,
    currBizPlanList,
    mainRef,
    orders,
    allServices,
    thisDueDate,
}) => {
    const currPlan = getCurrPlan(orders);

    adminData.clientAdminData.bizPlan = currPlan;
    adminData.clientAdminData.bizPlanList = setCurrPlan(
        currBizPlanList,
        orders,
        {
            allServices,
            currPlan,
            usageTimeEnd: thisDueDate,
            ref: mainRef,
        }
    );

    return adminData;
};
