import { useState, useEffect } from "react";
import pricing from "utils/biz/pricing";
import PricingTableBtn from "components/pricing-table/btn/PricingTableBtn";
import useBackColor from "hooks/useBackColor";
import useDetectScrollSingle from "hooks/scroll/useDetectScrollSingle";
import {
    SilverBtn,
    BronzeBtn,
} from "components/pricing-table/select-plan-btns/ProBtns";
import { Load } from "components/code-splitting/LoadableComp";
import useDetectScrollUp from "hooks/scroll/useDetectScrollUp";
import { updateItem, removeItem, useOrderTotal } from "./helpers/customerOrder";
import ReturnBtn from "../../dashboard-client-admin/ReturnBtn";
import MainTitle, { CircleBack } from "./comps/MainTitle";
import {
    MinimizedUpperOptions,
    ContinueBtn,
    TotalInvest,
    PeriodSelection,
} from "./comps/MainComps";
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

export default function GoldPlan({ setCurrPlan }) {
    const [nextPage, setNextPage] = useState(false);
    const [data, setData] = useState({
        orderCount: 0,
        orderAmount: 0,
        orderList: [],
        period: "monthly",
    });
    const { orderList, orderCount, orderAmount, period } = data;
    const isYearly = period === "yearly";

    const handleItem = (action, payload) => {
        const actions = ["update", "remove"];
        if (!actions.includes(action))
            throw new Error(`Invalid action. Only ${actions}`);
        const isUpdate = action === "update";

        if (isUpdate) updateItem({ ...payload, setData });
        else removeItem({ itemName: payload, setData });
    };
    useBackColor("var(--mainWhite)");
    useOrderTotal({ orderList, setData });
    useSetInitialPlanTotal({ period, setData });

    const showMainUpperOpts = useDetectScrollSingle(".period-selection");
    const isScrollingUpward = useDetectScrollUp();

    const styles = getStyles();

    const showPlanSwitchBtns = () => (
        <section className="animated fadeInDown" style={styles.root}>
            <div className="d-flex justify-content-end">
                <div className="position-relative" style={{ marginRight: 25 }}>
                    <SilverBtn setCurrPlan={setCurrPlan} />
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
                            hidePlan="gold"
                            currPlanBr="Ouro"
                            period={period}
                            setCurrPlan={setCurrPlan}
                            isScrollingUpward={isScrollingUpward}
                        />
                    ) : (
                        showPlanSwitchBtns()
                    )}
                    <MainTitle planMsg="Cadastre novos clientes e membros de forma ilimitada" />
                    <section className="period-selection">
                        <PeriodSelection
                            orderList={orderList}
                            setData={setData}
                            plan="gold"
                        />
                    </section>
                    <div style={{ height: 130 }} />

                    <MainServices isYearly={isYearly} plan="gold" />

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
                    />
                    <ContinueBtn onClick={() => setNextPage(true)} />
                </section>
            ) : (
                <AsyncOrdersAndPay
                    plan="ouro"
                    period={period}
                    setNextPage={setNextPage}
                    orderList={orderList}
                    orderTotal={orderAmount}
                />
            )}
        </section>
    );
}

// HOOKS
function useSetInitialPlanTotal({ period, setData }) {
    useEffect(() => {
        const allFullPlanServices = ["Novvos Clientes", "Novvos Membros"];
        const fullPlanList = allFullPlanServices.map((serviceName) => ({
            range: "fullPlan",
            expirable: true,
            name: serviceName,
            count: pricing.gold[serviceName].credit[period],
            creditType:
                serviceName === "Novvos Clientes" ? "accumulative" : "fixed",
            amount: pricing.gold[serviceName].price[period],
        }));

        const handleStartInvest = () => {
            setData((prev) => {
                const extraItemList = prev.orderList.filter(
                    (o) => o.type !== "fullPlan"
                );

                return {
                    ...prev,
                    orderList: [...extraItemList, ...fullPlanList],
                };
            });
        };

        handleStartInvest();

        // eslint-disable-next-line
    }, [period]);
}
// END HOOKS

/* ARCHIVES
<AddClientsToCart
    modalData={modalClientsData}
    orderList={orderList}
    disableCliUser
/>

*/
