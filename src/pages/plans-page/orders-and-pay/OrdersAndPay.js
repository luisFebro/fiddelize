import { useEffect, useState } from "react";
import { getVars, removeVar } from "init/var";
import useBackColor from "hooks/useBackColor";
import showToast from "components/toasts";
import useScrollUp from "hooks/scroll/useScrollUp";
import setProRenewal, { removeProRenewal } from "utils/biz/setProRenewal";
import { getServiceSKU } from "utils/string/getSKUCode";
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
    const [data, setData] = useState({
        reference: "",
        itemList: [],
        itemsCount: 0,
        investAmount: 0,
    });
    const { itemList, itemsCount, investAmount } = data;

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
                        reference: setRef(itemsCount2, planBr, period),
                        planBr: plan,
                        period,
                        itemsCount: orderList ? orderList.length : 0,
                        investAmount: orderTotal,
                    }),
                ]);
            }

            // eslint-disable-next-line
            const [
                pendingOrder_itemList,
                pendingOrder_planBr,
                pendingOrder_period,
                pendingOrder_investAmount,
                pendingOrder_reference,
            ] = await getVars([
                "pendingOrder_itemList",
                "pendingOrder_planBr",
                "pendingOrder_period",
                "pendingOrder_investAmount",
            ]);

            const itemsCount2 = pendingOrder_itemList
                ? pendingOrder_itemList.length
                : 0;

            // when passing a reference here, it means renewal of service executed in the backend.
            // it doesn't require when comes from the planstore since the reference can be diff and created with setRef
            setData({
                reference:
                    pendingOrder_reference ||
                    setRef(
                        itemsCount2,
                        pendingOrder_planBr,
                        pendingOrder_period
                    ),
                itemList: pendingOrder_itemList,
                itemsCount: itemsCount2,
                investAmount: pendingOrder_investAmount,
                period: pendingOrder_period,
                planBr: pendingOrder_planBr,
            });
        })();
    }, [plan, orderList, orderTotal, period]);

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
                investAmount={investAmount}
                itemList={orderList}
                itemsCount={itemsCount}
                plan={plan}
                period={period}
                removeVar={removeVar}
                setNextPage={setNextPage}
                handleCancel={handleCancel}
                notesColor="purple"
            />
            <PayArea
                plan={plan}
                period={period}
                handleCancel={handleCancel}
                investAmount={investAmount}
                itemList={orderList}
                itemsCount={itemsCount}
            />
        </section>
    );
}

// HELPERS
function setRef(itemsCount, planBr, period) {
    return getServiceSKU({
        total: itemsCount,
        planBr,
        period,
    });
}
// END HELPERS
