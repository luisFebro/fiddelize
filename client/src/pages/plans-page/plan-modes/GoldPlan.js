import React, { useState } from "react";
import { SilverBtn, BronzeBtn } from "../ProBtns";
import ReturnBtn from "../../dashboard-client-admin/ReturnBtn";
import MainTitle, { CircleBack } from "./comps/MainTitle";
import { ContinueBtn, TotalInvest, PeriodSelection } from "./comps/MainComps";
import useBackColor from "../../../hooks/useBackColor";
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

export default function GoldPlan({ setCurrPlan }) {
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
                    <SilverBtn setCurrPlan={setCurrPlan} />
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
                planMsg="Desvende todo o potencial da Fiddelize.
                Invista menos por cada serviço."
            />
            <PeriodSelection handlePeriod={handlePeriod} />
            <ServicesCard
                plan="gold"
                period={period}
                handleTotalInvest={handleTotalInvest}
            />
            <AddSMS />
            <OffplanServices />

            <TotalInvest totalInvest={totalInvest} />
            <ContinueBtn />
        </section>
    );
}
