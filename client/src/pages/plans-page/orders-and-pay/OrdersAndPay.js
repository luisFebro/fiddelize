import React, { useEffect } from "react";
import ReturnBtn from "../../dashboard-client-admin/ReturnBtn";
import OrdersTable from "./OrdersTable";
import PayArea from "./PayArea";
import { setVar, removeVar } from "../../../hooks/storage/useVar";
import useBackColor from "../../../hooks/useBackColor";
import useGetVar from "../../../hooks/storage/useVar";
import { useStoreDispatch } from "easy-peasy";
import { showSnackbar } from "../../../redux/actions/snackbarActions";
import useScrollUp from "../../../hooks/scroll/useScrollUp";

export default function OrdersAndPay({
    orders,
    orderTotal,
    plan,
    setNextPage,
}) {
    const dispatch = useStoreDispatch();

    useBackColor("var(--mainWhite)");

    useScrollUp();

    const { data, loading } = useGetVar("orders_clientAdmin");
    const { data: dataPlan, loading: loadPlan } = useGetVar(
        "ordersPlan_clientAdmin"
    );
    orders = !orders ? data : orders;
    plan = !plan ? dataPlan : plan;

    useEffect(() => {
        if (!loading) setVar({ orders_clientAdmin: orders });
        if (!loadPlan) setVar({ ordersPlan_clientAdmin: plan });
    }, [orders, loading, loadPlan]);

    const showTitle = () => (
        <div className="my-3">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                Seu Pedido
            </p>
        </div>
    );

    const showSubtitle = () => (
        <p className="my-5 text-center font-weight-bold position-relative mx-3 text-purple text-normal">
            Confira os serviços adicionados.
        </p>
    );

    const handleCancel = (need) => {
        const msg = need === "noMsg";
        !msg && showSnackbar(dispatch, "Seu pedido atual foi cancelado.");
        removeVar("orders_clientAdmin");
        removeVar("totalServices_clientAdmin");
        removeVar("totalMoney_clientAdmin");
        removeVar("ordersPlan_clientAdmin");
    };

    return (
        <section>
            {setNextPage && (
                <ReturnBtn icon="arrow-left" onClick={() => setNextPage()} />
            )}
            {showTitle()}
            {showSubtitle()}
            <OrdersTable
                orders={orders}
                plan={plan}
                orderTotal={orderTotal}
                setVar={setVar}
                removeVar={removeVar}
                useGetVar={useGetVar}
                setNextPage={setNextPage}
                handleCancel={handleCancel}
            />
            <PayArea handleCancel={handleCancel} />
        </section>
    );
}
