import { useEffect, useState } from "react";
import ReturnBtn from "../../dashboard-client-admin/ReturnBtn";
import OrdersTable from "./OrdersTable";
import PayArea from "./PayArea";
import useData from "init";
import { setVar, removeVar } from "init/var";
import useBackColor from "../../../hooks/useBackColor";

import showToast from "../../../components/toasts";
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
        renewalDaysLeft: null,
        renewalReference: null,
    });
    const {
        servicesAmount,
        servicesTotal,
        renewalDaysLeft,
        renewalReference,
    } = dataSer;

    const handleServicesData = (payload) => {
        setDataSer({ ...dataSer, ...payload });
    };

    useBackColor("var(--mainWhite)");

    useScrollUp();

    const [
        data,
        dataPlan,
        dataPeriod,
        dataMoney,
        daysLeftData,
        refData,
        isSingleRenewal,
    ] = useData([
        "orders_clientAdmin",
        "ordersPlan_clientAdmin",
        "planPeriod_clientAdmin",
        "totalMoney_clientAdmin",
        "renewalDaysLeft_clientAdmin",
        "renewalRef_clientAdmin",
        "isSingleRenewal_clientAdmin",
    ]);
    const loading = data !== "...";

    orders = !orders ? data : orders;
    plan = !plan ? dataPlan || "bronze" : plan;
    period = !period ? dataPeriod || "yearly" : period;
    orderTotal = !orderTotal ? dataMoney : orderTotal;

    useEffect(() => {
        if (!loading) return;
        if (orders) setVar({ orders_clientAdmin: orders });
        if (plan) setVar({ ordersPlan_clientAdmin: plan });
        if (period) setVar({ planPeriod_clientAdmin: period });
        if (orderTotal) setVar({ totalMoney_clientAdmin: orderTotal });

        if (daysLeftData)
            setDataSer({ ...dataSer, renewalDaysLeft: daysLeftData });
        if (refData)
            setDataSer({
                ...dataSer,
                renewalReference: refData || undefined,
            });
    }, [loading, daysLeftData, refData]);

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

    const handleCancel = (type) => {
        const explicitCancel = type === "explicit";
        if (explicitCancel) showToast("Seu pedido atual foi cancelado.");
        removeVar("orders_clientAdmin");
        removeVar("totalServices_clientAdmin");
        removeVar("totalMoney_clientAdmin");
        removeVar("ordersPlan_clientAdmin");
        removeVar("planPeriod_clientAdmin");
        removeVar("renewalDaysLeft_clientAdmin");
        removeVar("renewalRef_clientAdmin");
        removeVar("isSingleRenewal_clientAdmin");
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
                renewalDaysLeft={renewalDaysLeft}
                renewalReference={renewalReference}
                isSingleRenewal={isSingleRenewal}
            />
        </section>
    );
}
