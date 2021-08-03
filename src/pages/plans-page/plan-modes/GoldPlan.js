import { useState, useEffect } from "react";
import { SilverBtn, BronzeBtn } from "../ProBtns";
import ReturnBtn from "../../dashboard-client-admin/ReturnBtn";
import MainTitle, { CircleBack } from "./comps/MainTitle";
import {
    MinimizedUpperOptions,
    ContinueBtn,
    TotalInvest,
    PeriodSelection,
} from "./comps/MainComps";
import useBackColor from "../../../hooks/useBackColor";
import getServices from "./sessions/services/getServices";
import useDetectScrollSingle from "../../../hooks/scroll/useDetectScrollSingle";
import useDetectScrollUp from "../../../hooks/scroll/useDetectScrollUp";
import { updateItem, removeItem, useOrderTotal } from "./helpers/customerOrder";

// sessions
import IntegratedServicesCard from "./sessions/services/IntegratedServicesCard";
import AddSMS from "./sessions/AddSMS";
// import AddClientsToCart from "./sessions/AddClientsToCart";

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

export default function GoldPlan({ setCurrPlan }) {
    const [nextPage, setNextPage] = useState(false);
    const [data, setData] = useState({
        orderCount: 0,
        orderAmount: 0,
        orderList: [],
        period: "monthly",
    });
    const { orderList, orderCount, orderAmount, period } = data;
    // console.table("orderList", orderList);

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

    // const modalClientsData = {
    //     handleItem,
    //     period,
    // };

    const handlePeriod = (newPeriod) => {
        setData({ ...data, period: newPeriod });
    };

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
                    <MainTitle
                        planMsg="Cadastre novos clientes e membros de forma ilimitada" // Desvende todo o potencial da Fiddelize para seu negócio. Invista menos por cada serviço.
                    />
                    <section className="period-selection">
                        <PeriodSelection handlePeriod={handlePeriod} />
                    </section>
                    <div style={{ height: 130 }} />

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
                                    R$ 1.800
                                </span>
                                <br />
                                por R$ 1.500
                            </p>
                        </div>
                    )}

                    <p className="mx-3 text-subtitle font-weight-bold text-purple text-center">
                        <span className="text-pill">Serviços Extras</span>
                    </p>
                    <AddSMS
                        orderList={orderList}
                        handleItem={handleItem}
                        top={-80}
                    />
                    <div style={{ marginBottom: 100 }} />

                    <IntegratedServicesCard />
                    <div style={{ marginBottom: 100 }} />

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
        const { newCount, newAmount } = getServices("pro", {
            total: true,
            plan: "gold",
            period,
        });

        const handleStartInvest = () => {
            setData((prev) => {
                const prevClearedList = prev.orderList.filter(
                    (o) => o.name !== "currPlan"
                );

                return {
                    ...prev,
                    orderList: [
                        ...prevClearedList,
                        {
                            name: "currPlan",
                            count: newCount,
                            amount: newAmount,
                        },
                    ],
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
