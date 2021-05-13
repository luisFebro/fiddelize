import { useState, useEffect } from "react";
import { GoldBtn, BronzeBtn } from "../ProBtns";
import ReturnBtn from "../../dashboard-client-admin/ReturnBtn";
import MainTitle, { CircleBack } from "./comps/MainTitle";
import useBackColor from "../../../hooks/useBackColor";
import {
    MinimizedUpperOptions,
    ContinueBtn,
    TotalInvest,
    PeriodSelection,
} from "./comps/MainComps";
import useDetectScrollSingle from "../../../hooks/scroll/useDetectScrollSingle";
import useDetectScrollUp from "../../../hooks/scroll/useDetectScrollUp";

// sessions
import ServicesCard from "./sessions/services/ServicesCard";
import AddClientsToCart from "./sessions/AddClientsToCart";
import AddSMS from "./sessions/AddSMS";
import getServices from "./sessions/services/getServices";

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

const defaultOrders = {
    currPlan: { amount: 0, price: 0 },
};

export default function SilverPlan({ setCurrPlan }) {
    const [currService, setCurrService] = useState(null);
    const [nextPage, setNextPage] = useState(false);
    const [data, setData] = useState({
        totalInvest: 0,
        totalServices: 0,
        period: "yearly",
        orders: defaultOrders,
    });
    const { totalInvest, totalServices, period, orders } = data;

    const showMainUpperOpts = useDetectScrollSingle(".period-selection");
    const isScrollingUpward = useDetectScrollUp();

    useEffect(() => {
        let total = 0;

        const defaultQuantity = orders.currPlan.amount - 1; // this amount counts twicein the obj
        let totalServ = 0;
        for (const serv in orders) {
            ++totalServ;
            total += orders[serv].price;
        }

        setData({
            ...data,
            totalInvest: total,
            totalServices: defaultQuantity + totalServ,
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
        const newTotal = orders.currPlan.price + orderPrice;

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

    const modalClientsData = {
        handleNewOrder,
        period,
    };

    const handlePeriod = (newPeriod) => {
        setData({ ...data, period: newPeriod });
    };

    const handleStartInvest = (newAmount, newTotal) => {
        setData({
            ...data,
            orders: {
                ...defaultOrders,
                currPlan: { amount: newAmount, price: newTotal },
            },
        });
    };

    useEffect(() => {
        const { newAmount, newTotal } = getServices("pro", {
            total: true,
            plan: "silver",
            period,
        });

        handleStartInvest(newAmount, newTotal);
    }, [period]);

    useBackColor("var(--mainWhite)");

    const showPlanSwitchBtns = () => (
        <section className="animated fadeInDown" style={styles.root}>
            <div className="d-flex justify-content-end">
                <div className="position-relative" style={{ marginRight: 25 }}>
                    <GoldBtn setCurrPlan={setCurrPlan} />
                </div>
                <BronzeBtn setCurrPlan={setCurrPlan} />
            </div>
        </section>
    );

    return (
        <section style={{ marginBottom: 150 }}>
            {!nextPage ? (
                <section>
                    <CircleBack />
                    <ReturnBtn />
                    {!showMainUpperOpts ? (
                        <MinimizedUpperOptions
                            hidePlan="silver"
                            currPlanBr="Prata"
                            period={period}
                            setCurrPlan={setCurrPlan}
                            isScrollingUpward={isScrollingUpward}
                        />
                    ) : (
                        showPlanSwitchBtns()
                    )}
                    <MainTitle
                        plan="Prata"
                        planMsg="Construa seu clube de compras com +5.000 apps de clientes e principais serviços da Fiddelize" // "Adquira os principais serviços da Fiddelize com desconto."
                    />
                    <section className="period-selection">
                        <PeriodSelection handlePeriod={handlePeriod} />
                    </section>
                    <div style={{ height: 50 }} />

                    <ServicesCard plan="silver" period={period} />
                    <div style={{ marginBottom: 100 }} />

                    <AddClientsToCart
                        modalData={modalClientsData}
                        clientOrder={orders[currService]}
                        currService={currService}
                        disableCliUser
                    />
                    <div style={{ marginBottom: 100 }} />

                    <AddSMS
                        smsOrder={orders.sms}
                        handleNewOrder={handleNewOrder}
                    />

                    <TotalInvest
                        totalInvest={totalInvest}
                        totalServices={totalServices}
                    />
                    <ContinueBtn onClick={() => setNextPage(true)} />
                </section>
            ) : (
                <AsyncOrdersAndPay
                    plan="prata"
                    period={period}
                    setNextPage={setNextPage}
                    orders={orders}
                    orderTotal={totalInvest}
                />
            )}
        </section>
    );
}
