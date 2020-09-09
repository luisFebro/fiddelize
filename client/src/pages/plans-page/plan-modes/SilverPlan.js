import React from "react";
import { GoldBtn, BronzeBtn } from "../ProBtns";
import ReturnBtn from "../../dashboard-client-admin/ReturnBtn";

const getStyles = () => ({
    root: {
        position: "fixed",
        top: 15,
        right: 15,
    },
});

export default function SilverPlan({ setCurrPlan }) {
    const styles = getStyles();

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
            <ReturnBtn />
            {showPlanSwitchBtns()}
            <p
                style={{ marginTop: 100 }}
                className="text-center text-white text-hero"
            >
                silver plan
            </p>
        </section>
    );
}
