import { Fragment } from "react";
import { Load } from "../../../components/code-splitting/LoadableComp";

const AsyncGoldPlan = Load({
    loader: () =>
        import("./GoldPlan" /* webpackChunkName: "pro-gold-session-lazy" */),
});

const AsyncSilverPlan = Load({
    loader: () =>
        import(
            "./SilverPlan" /* webpackChunkName: "pro-silver-session-lazy" */
        ),
});

const AsyncBronzePlan = Load({
    loader: () =>
        import(
            "./BronzePlan" /* webpackChunkName: "pro-bronze-session-lazy" */
        ),
});

export default function HandlePlan({ currPlan: status, setCurrPlan }) {
    return (
        <Fragment>
            {status === "gold" && <AsyncGoldPlan setCurrPlan={setCurrPlan} />}

            {status === "silver" && (
                <AsyncSilverPlan setCurrPlan={setCurrPlan} />
            )}

            {status === "bronze" && (
                <AsyncBronzePlan setCurrPlan={setCurrPlan} />
            )}
        </Fragment>
    );
}
