import React, { Fragment } from "react";
import DashSectionTitle from "../../DashSectionTitle";
import InvestHistory from "./investments-history/InvestHistory";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import ShowConfigExpansiblePanel from './expansible-panel/ShowExpansiblePanel';
// import BottomActionBtns from './BottomActionBtns';

const DashProTitle = <Title />;

export default function AsyncDashPro() {
    return (
        <Fragment>
            <div style={{ marginTop: "16px", display: "block" }}>
                <DashSectionTitle title={DashProTitle} />
            </div>
            <InvestHistory />
        </Fragment>
    );
}

function Title() {
    return (
        <Fragment>
            <span className="text-subtitle  font-weight-bold">
                Club Pro
                <br />
                Fiddelize
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
