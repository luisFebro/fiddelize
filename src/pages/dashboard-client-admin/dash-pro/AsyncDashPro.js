import { Fragment } from "react";
import DashSectionTitle from "../../DashSectionTitle";
import InvestHistory from "./investments-history/InvestHistory";
import PlanAndServicesArea from "./PlanAndServicesArea";

const DashProTitle = <Title />;

export default function AsyncDashPro() {
    return (
        <Fragment>
            <div style={{ marginTop: "16px", display: "block" }}>
                <DashSectionTitle title={DashProTitle} />
            </div>
            <PlanAndServicesArea />
            <InvestHistory />
        </Fragment>
    );
}

function Title() {
    return (
        <Fragment>
            <span className="text-subtitle  font-weight-bold">
                CLUB PRO
                <br />
                FIDDELIZE
            </span>
        </Fragment>
    );
}

/* ARCHIVES
<main className="mt-2">
    <ShowConfigExpansiblePanel />
</main>
<BottomActionBtns />
 */
