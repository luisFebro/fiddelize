import { useState } from "react";
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
import IntegratedServicesCard from "./sessions/services/IntegratedServicesCard";
import { updateItem, removeItem, useOrderTotal } from "./helpers/customerOrder";

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
        orderCount: 0,
        orderAmount: 0,
        orderList: [],
        period: "monthly",
    });
    const { orderList, orderAmount, orderCount, period } = data;

    const handleItem = (action, payload) => {
        const actions = ["update", "remove"];
        if (!actions.includes(action))
            throw new Error(`Invalid action. Only ${actions}`);
        const isUpdate = action === "update";

        if (isUpdate) updateItem({ ...payload, setData });
        else removeItem({ itemName: payload, setData });
    };
    useOrderTotal({ orderList, setData });

    useScrollUp();
    const isScrollingUpward = useDetectScrollUp();
    const showMainUpperOpts = useDetectScrollSingle(".period-selection");

    const styles = getStyles();

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
        handleItem,
        period,
    };

    const handleNextPage = () => {
        if (!orderAmount)
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
                        customPlanTitle="Meu Plano"
                        plan="Bronze"
                        planMsg={`
                            Monte seu plano escolhendo preços e quantias dos serviços que precisar.
                        `}
                    />
                    <section className="period-selection">
                        <PeriodSelection
                            handlePeriod={handlePeriod}
                            orderList={orderList}
                            plan="bronze"
                        />
                    </section>
                    <div style={{ height: 180 }} />

                    <AddClientsToCart
                        modalData={modalClientsData}
                        orderList={orderList}
                    />
                    <div style={{ marginBottom: 100 }} />

                    <p className="mx-3 text-subtitle font-weight-bold text-purple text-center">
                        <span className="text-pill">Serviços Extras</span>
                    </p>
                    <AddSMS
                        orderList={orderList}
                        handleItem={handleItem}
                        top={-80}
                    />
                    <div style={{ marginBottom: 100 }} />

                    <ServicesGallery handleItem={handleItem} period={period} />
                    <div style={{ marginBottom: 100 }} />

                    <IntegratedServicesCard />
                    <div style={{ marginBottom: 100 }} />

                    <TotalInvest
                        orderAmount={orderAmount}
                        orderCount={orderCount}
                    />
                    <ContinueBtn onClick={handleNextPage} />
                </section>
            ) : (
                <AsyncOrdersAndPay
                    plan="bronze"
                    period={period}
                    setNextPage={setNextPage}
                    orderList={orderList}
                    orderTotal={orderAmount}
                />
            )}
        </section>
    );
}
