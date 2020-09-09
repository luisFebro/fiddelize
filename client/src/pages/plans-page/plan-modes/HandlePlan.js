import React, { Fragment } from "react";
import GoldPlan from "./GoldPlan";
import SilverPlan from "./SilverPlan";
import BronzePlan from "./BronzePlan";

export default function HandlePlan({ currPlan: status, setCurrPlan }) {
    return (
        <Fragment>
            {status === "gold" && <GoldPlan setCurrPlan={setCurrPlan} />}

            {status === "silver" && <SilverPlan setCurrPlan={setCurrPlan} />}

            {status === "bronze" && <BronzePlan setCurrPlan={setCurrPlan} />}
        </Fragment>
    );
}
