import { setVars, removeVars } from "init/var";

export default async function setProRenewal({
    ref,
    itemList,
    investAmount,
    planBr,
    period,
}) {
    return await setVars({
        pendingOrder_reference: ref,
        pendingOrder_itemList: itemList,
        pendingOrder_investAmount: investAmount,
        pendingOrder_period: period,
        pendingOrder_planBr: planBr,
        pendingOrder_itemsCount: itemList ? itemList.length : 0,
    });
}

export async function removeProRenewal() {
    return await removeVars([
        "pendingOrder_reference",
        "pendingOrder_itemList",
        "pendingOrder_investAmount",
        "pendingOrder_period",
        "pendingOrder_planBr",
    ]);
}
