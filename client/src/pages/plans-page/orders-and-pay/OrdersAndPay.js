import React, { useEffect, useState } from "react";
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
    period,
    plan,
    setNextPage,
}) {
    const [dataSer, setDataSer] = useState({
        servicesAmount: null,
        servicesTotal: null,
    });
    let { servicesAmount, servicesTotal } = dataSer;

    const handleServicesData = (payload) => {
        setDataSer({ ...dataSer, ...payload });
    };

    const dispatch = useStoreDispatch();

    useBackColor("var(--mainWhite)");

    useScrollUp();

    const { data, loading } = useGetVar("orders_clientAdmin");
    const { data: dataPlan, loading: loadPlan } = useGetVar(
        "ordersPlan_clientAdmin"
    );
    const { data: dataPeriod, loading: loadPeriod } = useGetVar(
        "planPeriod_clientAdmin"
    );
    orders = !orders ? data : orders;
    plan = !plan ? dataPlan : plan;
    period = !period ? dataPeriod : period;

    useEffect(() => {
        if (!loading) setVar({ orders_clientAdmin: orders });
        if (!loadPlan) setVar({ ordersPlan_clientAdmin: plan });
        if (!loadPeriod) setVar({ planPeriod_clientAdmin: period });
    }, [loading, loadPlan, loadPeriod]);

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

    const handleCancel = (type) => {
        const explicitCancel = type === "explicit";
        explicitCancel &&
            showSnackbar(dispatch, "Seu pedido atual foi cancelado.");
        explicitCancel && removeVar("orders_clientAdmin");
        removeVar("totalServices_clientAdmin");
        removeVar("totalMoney_clientAdmin");
        removeVar("ordersPlan_clientAdmin");
        removeVar("planPeriod_clientAdmin");
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
                period={period}
                orderTotal={orderTotal}
                setVar={setVar}
                removeVar={removeVar}
                useGetVar={useGetVar}
                setNextPage={setNextPage}
                handleCancel={handleCancel}
                handleServicesData={handleServicesData}
                notesColor="purple"
            />
            <PayArea
                plan={plan}
                period={period}
                handleCancel={handleCancel}
                servicesTotal={servicesTotal}
                servicesAmount={servicesAmount}
                ordersStatement={orders}
            />
        </section>
    );
}
