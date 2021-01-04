import React, { Fragment, useState, useEffect } from "react";
import { SilverBtn, BronzeBtn } from "../ProBtns";
import ReturnBtn from "../../dashboard-client-admin/ReturnBtn";
import MainTitle, { CircleBack } from "./comps/MainTitle";
import { ContinueBtn, TotalInvest, PeriodSelection } from "./comps/MainComps";
import useBackColor from "../../../hooks/useBackColor";
import getServices from "./sessions/services/getServices";

// sessions
import ServicesCard from "./sessions/services/ServicesCard";
import AddClientsToCart from "./sessions/AddClientsToCart";
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

const defaultOrders = {
    currPlan: { amount: 0, price: 0 },
};

export default function GoldPlan({ setCurrPlan }) {
    const [nextPage, setNextPage] = useState(false);
    const [currService, setCurrService] = useState(null);

    const [data, setData] = useState({
        totalInvest: 0,
        totalServices: 0,
        period: "yearly",
        orders: defaultOrders,
    });
    const { totalServices, totalInvest, period, orders } = data;

    useEffect(() => {
        let total = 0;

        const defaultQuantity = orders.currPlan.amount - 1; // this amount counts twicein the obj
        let totalServ = 0;
        for (let serv in orders) {
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
        let newTotal = orders.currPlan.price + orderPrice;

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
            plan: "gold",
            period,
        });

        handleStartInvest(newAmount, newTotal);
    }, [period]);

    useBackColor("var(--mainWhite)");

    const showPlanSwitchBtns = () => (
        <section style={styles.root}>
            <div className="d-flex justify-content-end">
                <div className="position-relative" style={{ marginRight: 25 }}>
                    <SilverBtn setCurrPlan={setCurrPlan} />
                </div>
                <BronzeBtn setCurrPlan={setCurrPlan} />
            </div>
        </section>
    );

    return (
        <Fragment>
            {!nextPage ? (
                <section>
                    <CircleBack />
                    <ReturnBtn />
                    {showPlanSwitchBtns()}
                    <MainTitle
                        planMsg="Desvende todo o potencial da Fiddelize.
                        Invista menos por cada serviço."
                    />
                    <PeriodSelection handlePeriod={handlePeriod} />

                    <ServicesCard plan="gold" period={period} />

                    <AddClientsToCart
                        modalData={modalClientsData}
                        clientOrder={orders[currService]}
                        currService={currService}
                        disableCliUser={true}
                    />

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
                    plan="ouro"
                    period={period}
                    setNextPage={setNextPage}
                    orders={orders}
                    orderTotal={totalInvest}
                />
            )}
        </Fragment>
    );
}
