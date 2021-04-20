import { useState, useEffect } from "react";
import { GoldBtn, SilverBtn } from "../ProBtns";
import ReturnBtn from "../../dashboard-client-admin/ReturnBtn";
import MainTitle, { CircleBack } from "./comps/MainTitle";
import useBackColor from "../../../hooks/useBackColor";
import {
    MinimizedUpperOptions,
    ContinueBtn,
    TotalInvest,
    PeriodSelection,
} from "./comps/MainComps";
import showToast from "../../../components/toasts";
import useDetectScrollSingle from "../../../hooks/scroll/useDetectScrollSingle";
import useDetectScrollUp from "../../../hooks/scroll/useDetectScrollUp";
import useScrollUp from "../../../hooks/scroll/useScrollUp";

// Sessions
import AddClientsToCart from "./sessions/AddClientsToCart";
import ServicesGallery from "./sessions/services/gallery/ServicesGallery";
import AddSMS from "./sessions/AddSMS";

import { Load } from "../../../components/code-splitting/LoadableComp";

const AsyncOrdersAndPay = Load({
    loader: () =>
        import(
            "../orders-and-pay/OrdersAndPay" /* webpackChunkName: "orders-and-pay-page-lazy" */
        ),
});

const getStyles = () => ({
    root: {
        position: "fixed",
        top: 15,
        right: 15,
        zIndex: 2000,
    },
});

export default function BronzePlan({ setCurrPlan }) {
    const [nextPage, setNextPage] = useState(false);
    const [currService, setCurrService] = useState(null);
    const [data, setData] = useState({
        totalInvest: 0,
        totalServices: 0,
        period: "yearly",
        orders: {}, // e.g { "Novvos Clientes": { amount: 0, price: 0, expiryDate: dateFormat }
    });
    const { totalInvest, totalServices, period, orders } = data;
    // console.table(data); // for objects without the necessary of using JSON.stringify(obj)
    const showMainUpperOpts = useDetectScrollSingle(".period-selection");
    useScrollUp();
    const isScrollingUpward = useDetectScrollUp();

    useEffect(() => {
        let total = 0;

        let totalServ = 0;
        for (const serv in orders) {
            ++totalServ;
            total += orders[serv].price;
        }

        setData({
            ...data,
            totalInvest: total,
            totalServices: totalServ,
        });
    }, [orders]);

    const styles = getStyles();

    const handleNewOrder = (serviceName, options = {}) => {
        setCurrService(serviceName);

        const {
            order,
            orderGroup,
            orderGroupPrice = 0,
            removeOrderGroup,
        } = options;

        const orderPrice = order ? order.price : orderGroupPrice;
        const newTotal = orderPrice;

        // for SMS logics
        const needCurrRemoval = order && order.removeCurr;
        needCurrRemoval &&
            setData({
                ...data,
                orders: { ...orders, [serviceName]: orders[serviceName] },
            });

        const handleOrderShape = () => {
            if (removeOrderGroup) {
                const newOrder = orders;
                delete newOrder[removeOrderGroup];
                return { ...orders, ...newOrder };
            }
            return orderGroup
                ? { ...orders, ...orderGroup }
                : { ...orders, [serviceName]: order };
        };
        const ordersObj = handleOrderShape();

        setData({ ...data, orders: ordersObj });
    };

    const handlePeriod = (newPeriod) => {
        setData({ ...data, period: newPeriod });
    };

    useBackColor("var(--mainWhite)");

    const showPlanSwitchBtns = () => (
        <section className="animated fadeInDown" style={styles.root}>
            <div className="d-flex justify-content-end">
                <div className="position-relative" style={{ marginRight: 25 }}>
                    <GoldBtn setCurrPlan={setCurrPlan} />
                </div>
                <SilverBtn setCurrPlan={setCurrPlan} />
            </div>
        </section>
    );

    const modalClientsData = {
        handleNewOrder,
        period,
    };

    const handleNextPage = () => {
        if (!totalInvest)
            return showToast("Carrinho Vazio! Selecione algum serviço.");
        setNextPage(true);
    };

    return (
        <section style={{ marginBottom: 150 }}>
            {!nextPage ? (
                <section>
                    <CircleBack />
                    <ReturnBtn />
                    {!showMainUpperOpts ? (
                        <MinimizedUpperOptions
                            hidePlan="bronze"
                            currPlanBr="Bronze"
                            period={period}
                            setCurrPlan={setCurrPlan}
                            isScrollingUpward={isScrollingUpward}
                        />
                    ) : (
                        showPlanSwitchBtns()
                    )}
                    <MainTitle
                        customPlanTitle="Meu"
                        plan="Bronze"
                        planMsg="Faça seu próprio plano.<br />Escolha seu preço."
                    />
                    <section className="period-selection">
                        <PeriodSelection handlePeriod={handlePeriod} />
                    </section>
                    <div style={{ height: 180 }} />

                    <AddClientsToCart
                        modalData={modalClientsData}
                        clientOrder={orders[currService]}
                        currService={currService}
                    />
                    <div style={{ marginBottom: 100 }} />

                    <ServicesGallery
                        handleNewOrder={handleNewOrder}
                        period={period}
                    />
                    <div style={{ marginBottom: 50 }} />

                    <AddSMS
                        smsOrder={orders.sms}
                        handleNewOrder={handleNewOrder}
                        top={-80}
                    />
                    <TotalInvest
                        totalInvest={totalInvest}
                        totalServices={totalServices}
                    />
                    <ContinueBtn onClick={handleNextPage} />
                </section>
            ) : (
                <AsyncOrdersAndPay
                    plan="bronze"
                    period={period}
                    setNextPage={setNextPage}
                    orders={orders}
                    orderTotal={totalInvest}
                />
            )}
        </section>
    );
}
