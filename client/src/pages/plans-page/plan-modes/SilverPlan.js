import React, { useState } from "react";
import { GoldBtn, BronzeBtn } from "../ProBtns";
import ReturnBtn from "../../dashboard-client-admin/ReturnBtn";
import MainTitle, { CircleBack } from "./comps/MainTitle";
import useBackColor from "../../../hooks/useBackColor";
import { ContinueBtn, TotalInvest, PeriodSelection } from "./comps/MainComps";
// sessions
import ServicesCard from "./sessions/services/ServicesCard";
import AddSMS from "./sessions/AddSMS";
import OffplanServices from "./sessions/services/offplan/OffplanServices";

const getStyles = () => ({
    root: {
        position: "fixed",
        top: 15,
        right: 15,
        zIndex: 2000,
    },
});

export default function SilverPlan({ setCurrPlan }) {
    const [data, setData] = useState({
        totalInvest: 0,
        period: "yearly",
    });
    const { totalInvest, period } = data;

    const handlePeriod = (newPeriod) => {
        setData({ ...data, period: newPeriod });
    };

    const handleTotalInvest = (newTotal) => {
        setData({ ...data, totalInvest: newTotal });
    };

    const styles = getStyles();

    useBackColor("var(--mainWhite)");

    const showPlanSwitchBtns = () => (
        <section style={styles.root}>
            <div className="d-flex justify-content-end">
                <div className="position-relative" style={{ marginRight: 25 }}>
                    <GoldBtn setCurrPlan={setCurrPlan} />
                </div>
                <BronzeBtn setCurrPlan={setCurrPlan} />
            </div>
        </section>
    );

    return (
        <section>
            <CircleBack />
            <ReturnBtn />
            {showPlanSwitchBtns()}
            <MainTitle
                plan="Prata"
                planMsg="Adquira os principais serviços da Fiddelize
                com desconto."
            />
            <PeriodSelection handlePeriod={handlePeriod} />
            <ServicesCard
                plan="silver"
                period={period}
                handleTotalInvest={handleTotalInvest}
            />
            <AddSMS />
            <OffplanServices />

            <TotalInvest />
            <ContinueBtn />
        </section>
    );
}
