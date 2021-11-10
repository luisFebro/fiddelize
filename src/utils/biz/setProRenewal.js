import { setVars, removeVars } from "init/var";

export default async function setProRenewal({
    itemList,
    investAmount,
    planBr,
    period,
}) {
    if (!itemList || !investAmount || !planBr || !period)
        throw new Error("Missing critical data for pro plan renewal");

    return await setVars({
        pendingOrderItemList: itemList || [],
        pendingOrderItemsCount: itemList ? itemList.length : 0,
        pendingOrderInvestAmount: Number(investAmount),
        pendingOrderPeriod: period,
        pendingOrderPlanBr: planBr,
    });
}

export async function removeProRenewal() {
    return await removeVars([
        "pendingOrderItemList",
        "pendingOrderItemsCount",
        "pendingOrderInvestAmount",
        "pendingOrderPeriod",
        "pendingOrderPlanBr",
    ]);
}
