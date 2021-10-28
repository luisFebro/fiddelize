import { useState, useEffect } from "react";
import PricingTableBtn from "components/pricing-table/btn/PricingTableBtn";
import pricing from "utils/biz/pricing";
import convertToReal from "utils/numbers/convertToReal";
import { GoldBtn, BronzeBtn } from "../ProBtns";
import ReturnBtn from "../../dashboard-client-admin/ReturnBtn";
import MainTitle, { CircleBack } from "./comps/MainTitle";
import useBackColor from "../../../hooks/useBackColor";
import { updateItem, removeItem, useOrderTotal } from "./helpers/customerOrder";
import {
    MinimizedUpperOptions,
    ContinueBtn,
    TotalInvest,
    PeriodSelection,
} from "./comps/MainComps";
import useDetectScrollSingle from "../../../hooks/scroll/useDetectScrollSingle";
import useDetectScrollUp from "../../../hooks/scroll/useDetectScrollUp";
import IntegratedServicesCard from "./sessions/services/IntegratedServicesCard";
import AddSMS from "./sessions/AddSMS";
import ServicesGallery from "./sessions/services/gallery/ServicesGallery";
import { PlanAdvantages, PlanContent } from "./ContentAndAdvantages";
import { Load } from "components/code-splitting/LoadableComp";

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

export default function SilverPlan({ setCurrPlan }) {
    const [nextPage, setNextPage] = useState(false);
    const [data, setData] = useState({
        orderCount: 0,
        orderAmount: 0,
        orderList: [],
        period: "monthly",
    });
    const { orderList, orderAmount, orderCount, period } = data;

    const clientCredits = convertToReal(
        pricing.silver["Novvos Clientes"].credit[period]
    );
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

    const handlePeriod = (newPeriod) => {
        setData({ ...data, period: newPeriod });
    };

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
                        planMsg={`Construa seu clube de compras com cadastro de até ${clientCredits} clientes únicos ao ${
                            isYearly ? "ano" : "mês"
                        }`}
                    />
                    <section className="period-selection">
                        <PeriodSelection
                            handlePeriod={handlePeriod}
                            orderList={orderList}
                            plan="silver"
                        />
                    </section>
                    <div style={{ height: 130 }} />

                    <PlanContent isYearly={isYearly} plan="silver" />

                    <PlanAdvantages isYearly={isYearly} plan="silver" />

                    <p className="mx-3 text-subtitle font-weight-bold text-purple text-center">
                        <span className="text-pill">Serviços Extras</span>
                    </p>

                    <AddSMS
                        orderList={orderList}
                        handleItem={handleItem}
                        top={-80}
                    />
                    <div style={{ marginBottom: 100 }} />

                    <ServicesGallery handleItem={null} period={period} />
                    <div style={{ marginBottom: 100 }} />

                    <IntegratedServicesCard />
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
                    plan="prata"
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
            count: pricing.silver[serviceName].credit[period],
            amount: pricing.silver[serviceName].price[period],
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

const modalClientsData = {
    handleItem,
    period,
};

<AddClientsToCart
    modalData={modalClientsData}
    orderList={orderList}
    disableCliUser
/>
<div style={{ marginBottom: 100 }} />

{period === "yearly" && (
    <div className="my-5 animated fadeInUp text-center text-purple text-normal font-weight-bold">
        <p>
            você economiza 20%
            <br />
            no plano anual
        </p>
        <p>
            de{" "}
            <span
                style={{ textDecoration: "line-through" }}
            >
                R$ 1.200
            </span>
            <br />
            por R$ 1.000
        </p>
    </div>
)}

*/
