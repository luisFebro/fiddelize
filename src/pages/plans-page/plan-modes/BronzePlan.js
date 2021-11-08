import { useState } from "react";
import PricingTableBtn from "components/pricing-table/btn/PricingTableBtn";
import { Load } from "components/code-splitting/LoadableComp";
import useBackColor from "hooks/useBackColor";
import showToast from "components/toasts";
import useDetectScrollSingle from "hooks/scroll/useDetectScrollSingle";
import useDetectScrollUp from "hooks/scroll/useDetectScrollUp";
import useScrollUp from "hooks/scroll/useScrollUp";
import usePro from "init/pro";
import {
    GoldBtn,
    SilverBtn,
} from "components/pricing-table/select-plan-btns/ProBtns";
import ReturnBtn from "../../dashboard-client-admin/ReturnBtn";
import MainTitle, { CircleBack } from "./comps/MainTitle";
import {
    MinimizedUpperOptions,
    ContinueBtn,
    TotalInvest,
    PeriodSelection,
} from "./comps/MainComps";
import { updateItem, removeItem, useOrderTotal } from "./helpers/customerOrder";
// services
import MainServices from "./services/main-services/MainServices";
import ExtraServices from "./services/extra-services/ExtraServices";
import IntegratedServices from "./services/integrated-services/IntegratedServices";

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
    const { isPro, plan } = usePro();

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
        if (orderAmount < 25)
            return showToast("Quantia mínima do pedido é de R$ 25");
        return setNextPage(true);
    };

    return (
        <section style={{ marginBottom: 150 }}>
            {!nextPage ? (
                <section>
                    <CircleBack isPro={isPro} />
                    <ReturnBtn />
                    {!showMainUpperOpts ? (
                        <MinimizedUpperOptions
                            hidePlan={isPro ? plan : "bronze"}
                            currPlanBr={isPro ? plan && plan.cap() : "Bronze"}
                            period={period}
                            setCurrPlan={setCurrPlan}
                            isScrollingUpward={isScrollingUpward}
                        />
                    ) : (
                        showPlanSwitchBtns()
                    )}
                    <MainTitle
                        customPlanTitle={isPro ? "Loja Serviços" : "Meu Plano"}
                        plan={isPro ? plan : "Bronze"}
                        planMsg={
                            isPro
                                ? "Renove ou adicione serviços extras ao seu plano atual"
                                : `
                            Escolha preços e quantias dos serviços que precisar.
                        `
                        }
                    />
                    <section className="period-selection">
                        <PeriodSelection
                            setData={setData}
                            orderList={orderList}
                            plan={isPro ? plan : "bronze"}
                        />
                    </section>
                    <div style={{ height: 180 }} />

                    <MainServices
                        modalData={modalClientsData}
                        orderList={orderList}
                    />
                    <div style={{ marginBottom: 100 }} />

                    <ExtraServices
                        orderList={orderList}
                        handleItem={handleItem}
                        period={period}
                    />
                    <div style={{ marginBottom: 50 }} />

                    <IntegratedServices />
                    <div style={{ marginBottom: 100 }} />

                    <PricingTableBtn setCurrPlan={setCurrPlan} />

                    <TotalInvest
                        orderAmount={orderAmount}
                        orderCount={orderCount}
                        isPro={isPro}
                    />
                    <ContinueBtn onClick={handleNextPage} />
                </section>
            ) : (
                <AsyncOrdersAndPay
                    plan={isPro ? plan : "bronze"}
                    period={period}
                    setNextPage={setNextPage}
                    orderList={orderList}
                    orderTotal={orderAmount}
                />
            )}
        </section>
    );
}
