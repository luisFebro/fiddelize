import { setVars, removeVars } from "init/var";

export default async function setProRenewal({
    itemList,
    investAmount,
    planBr,
    period,
    isRenewalBtn = true,
}) {
    if (!itemList || !investAmount || !planBr || !period)
        throw new Error("Missing critical data for pro plan renewal");

    return await setVars({
        pendingOrderIsRenewalBtn: isRenewalBtn, // identify if the user clicked a renewal btn or this order comes from the plan/services store
        pendingOrderItemList: itemList || [],
        pendingOrderItemsCount: itemList ? itemList.length : 0,
        pendingOrderInvestAmount: Number(investAmount),
        pendingOrderPeriod: period,
        pendingOrderPlanBr: planBr,
    });
}

export async function removeProRenewal() {
    return await removeVars([
        "pendingOrderIsRenewalBtn",
        "pendingOrderItemList",
        "pendingOrderItemsCount",
        "pendingOrderInvestAmount",
        "pendingOrderPeriod",
        "pendingOrderPlanBr",
    ]);
}
