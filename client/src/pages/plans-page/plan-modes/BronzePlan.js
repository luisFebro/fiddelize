import React from "react";
import { GoldBtn, SilverBtn } from "../ProBtns";
import ReturnBtn from "../../dashboard-client-admin/ReturnBtn";
import MainTitle, { CircleBack } from "./comps/MainTitle";
import useBackColor from "../../../hooks/useBackColor";
import { ContinueBtn, TotalInvest, PeriodSelection } from "./comps/MainComps";

const getStyles = () => ({
    root: {
        position: "fixed",
        top: 15,
        right: 15,
    },
});

export default function BronzePlan({ setCurrPlan }) {
    const styles = getStyles();

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

    const planMsg = "Faça seu próprio plano.<br />Escolha seu preço.";
    return (
        <section>
            <CircleBack />
            <ReturnBtn />
            {showPlanSwitchBtns()}
            <MainTitle customPlanTitle="Meu" plan="Bronze" planMsg={planMsg} />
            <PeriodSelection />
            <TotalInvest />
            <ContinueBtn />
        </section>
    );
}
