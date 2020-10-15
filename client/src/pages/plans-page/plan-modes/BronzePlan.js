import React, { useState, Fragment, useEffect } from "react";
import { GoldBtn, SilverBtn } from "../ProBtns";
import ReturnBtn from "../../dashboard-client-admin/ReturnBtn";
import MainTitle, { CircleBack } from "./comps/MainTitle";
import useBackColor from "../../../hooks/useBackColor";
import { ContinueBtn, TotalInvest, PeriodSelection } from "./comps/MainComps";
import { showSnackbar } from "../../../redux/actions/snackbarActions";
import { useStoreDispatch } from "easy-peasy";

// Sessions
import AddCustomerPackages from "./sessions/customer-packages/AddCustomerPackages";
import ServicesGallery from "./sessions/services/gallery/ServicesGallery";
import AddSMS from "./sessions/AddSMS";
import OffplanServices from "./sessions/services/offplan/OffplanServices";

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
    const [data, setData] = useState({
        totalInvest: 0,
        totalServices: 0,
        period: "yearly",
        orders: {}, // e.g { "Novvos Clientes": { amount: 0, price: 0, expiryDate: dateFormat }
    });
    const { totalInvest, totalServices, period, orders } = data;
    console.log("orders", orders);
    // console.table(data); // for objects without the necessary of using JSON.stringify(obj)
    const dispatch = useStoreDispatch();

    useEffect(() => {
        let total = 0;

        let totalServ = 0;
        for (let serv in orders) {
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
        const {
            order,
            orderGroup,
            orderGroupPrice = 0,
            removeOrderGroup,
        } = options;

        const orderPrice = order ? order.price : orderGroupPrice;
        let newTotal = orderPrice;

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
        <section style={styles.root}>
            <div className="d-flex justify-content-end">
                <div className="position-relative" style={{ marginRight: 25 }}>
                    <GoldBtn setCurrPlan={setCurrPlan} />
                </div>
                <SilverBtn setCurrPlan={setCurrPlan} />
            </div>
        </section>
    );

    const modalCustomersData = {
        handleNewOrder,
        period,
    };

    const handleNextPage = () => {
        if (!totalInvest)
            return showSnackbar(
                dispatch,
                "Carrinho Vazio! Selecione algum serviço."
            );
        setNextPage(true);
    };

    return (
        <Fragment>
            {!nextPage ? (
                <section>
                    <CircleBack />
                    <ReturnBtn />
                    {showPlanSwitchBtns()}
                    <MainTitle
                        customPlanTitle="Meu"
                        plan="Bronze"
                        planMsg="Faça seu próprio plano.<br />Escolha seu preço."
                    />
                    <PeriodSelection handlePeriod={handlePeriod} />

                    <AddCustomerPackages
                        modalData={modalCustomersData}
                        customersOrder={orders["Novvos Clientes"]}
                    />
                    <ServicesGallery
                        handleNewOrder={handleNewOrder}
                        period={period}
                    />
                    <AddSMS
                        smsOrder={orders.sms}
                        handleNewOrder={handleNewOrder}
                        top={-80}
                    />
                    <OffplanServices
                        handleNewOrder={handleNewOrder}
                        plan="bronze"
                        period={period}
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
        </Fragment>
    );
}
