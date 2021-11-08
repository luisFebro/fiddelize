import { useEffect, useState } from "react";
import { getVars, removeVar } from "init/var";
import useBackColor from "hooks/useBackColor";
import showToast from "components/toasts";
import useScrollUp from "hooks/scroll/useScrollUp";
import setProRenewal, { removeProRenewal } from "utils/biz/setProRenewal";
import { getServiceSKU } from "utils/string/getSKUCode";
import usePro from "init/pro";
import ReturnBtn from "../../dashboard-client-admin/ReturnBtn";
import OrdersTable from "./OrdersTable";
import PayArea from "./PayArea";

export default function OrdersAndPay({
    orderList,
    orderTotal,
    period,
    plan,
    setNextPage,
}) {
    const { isPro } = usePro();

    const [data, setData] = useState({
        reference: "",
        itemList: [],
        itemsCount: 0,
        investAmount: 0,
        planBr: "",
        periodEn: "",
    });
    const {
        reference,
        itemList,
        itemsCount,
        investAmount,
        planBr,
        periodEn,
    } = data;

    useScrollUp();
    useBackColor("var(--mainWhite)");

    useEffect(() => {
        (async () => {
            const isFromPlanStore = Boolean(plan);
            if (isFromPlanStore) {
                // set data from planStore to be restored if user decided to return later
                const itemsCount2 = orderList ? orderList.length : 0;

                return await Promise.all([
                    setProRenewal({
                        itemList: orderList,
                        investAmount: orderTotal,
                        planBr: plan,
                        period,
                    }),
                    setData({
                        reference: setRef(
                            itemsCount2,
                            plan,
                            period,
                            orderList,
                            isPro
                        ),
                        itemList: orderList,
                        itemsCount: orderList ? orderList.length : 0,
                        investAmount: orderTotal,
                        planBr: plan,
                        periodEn: period,
                    }),
                ]);
            }

            const [
                pendingOrderItemList,
                pendingOrderItemsCount,
                pendingOrderInvestAmount,
                pendingOrderPlanBr,
                pendingOrderPeriod,
            ] = await getVars([
                "pendingOrderItemList",
                "pendingOrderItemsCount",
                "pendingOrderInvestAmount",
                "pendingOrderPlanBr",
                "pendingOrderPeriod",
            ]);

            return setData({
                reference: setRef(
                    pendingOrderItemsCount,
                    pendingOrderPlanBr,
                    pendingOrderPeriod,
                    pendingOrderItemList,
                    isPro
                ),
                itemList: pendingOrderItemList,
                itemsCount: pendingOrderItemsCount,
                investAmount: pendingOrderInvestAmount,
                planBr: pendingOrderPlanBr,
                periodEn: pendingOrderPeriod,
            });
        })();

        // eslint-disable-next-line
    }, [isPro, plan, orderList, orderTotal, period]);

    const showTitle = () => (
        <div className="my-3">
            <p className="main-font text-em-1-9 text-purple text-center font-weight-bold">
                Seu Pedido
            </p>
        </div>
    );

    const showSubtitle = () => (
        <p className="my-5 text-center font-weight-bold position-relative mx-3 text-purple text-normal">
            Confira os serviços adicionados.
        </p>
    );

    const handleCancel = async (type) => {
        const explicitCancel = type === "explicit";
        if (explicitCancel) showToast("Seu pedido atual foi cancelado.");
        await removeProRenewal();
    };

    return (
        <section>
            {setNextPage && (
                <ReturnBtn icon="arrow-left" onClick={() => setNextPage()} />
            )}
            {showTitle()}
            {showSubtitle()}
            <OrdersTable
                setData={setData}
                investAmount={investAmount}
                itemList={itemList}
                itemsCount={itemsCount}
                planBr={planBr}
                period={periodEn}
                removeVar={removeVar}
                setNextPage={setNextPage}
                handleCancel={handleCancel}
            />
            <PayArea
                reference={reference}
                planBr={planBr}
                period={periodEn}
                handleCancel={handleCancel}
                investAmount={investAmount}
                itemList={itemList}
                itemsCount={itemsCount}
            />
        </section>
    );
}

// HELPERS
function setRef(itemsCount, planBr, period, itemList, isPro) {
    return getServiceSKU({
        total: itemsCount,
        planBr,
        period,
        itemList,
        isPro,
    });
}
// END HELPERS
