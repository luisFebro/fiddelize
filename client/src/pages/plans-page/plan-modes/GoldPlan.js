import React from "react";
import { SilverBtn, BronzeBtn } from "../ProBtns";
import ReturnBtn from "../../dashboard-client-admin/ReturnBtn";

const getStyles = () => ({
    root: {
        position: "fixed",
        top: 15,
        right: 15,
    },
});

export default function GoldPlan({ setCurrPlan }) {
    const styles = getStyles();

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
            <ReturnBtn />
            {showPlanSwitchBtns()}
            <p
                style={{ marginTop: 100 }}
                className="text-center text-white text-hero"
            >
                gold plan
            </p>
        </section>
    );
}
