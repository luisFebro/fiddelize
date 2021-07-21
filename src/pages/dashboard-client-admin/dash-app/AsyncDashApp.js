import { Fragment } from "react";
import DashSectionTitle from "../../DashSectionTitle";
import ShowMainPanels from "./main-panels/ShowMainPanels";
import "./DashApp.scss";

const AppDesignTitle = <Title />;
export default function AsyncDashApp() {
    return (
        <Fragment>
            <div style={{ marginTop: "16px", display: "block" }}>
                <DashSectionTitle title={AppDesignTitle} />
            </div>
            <main className="mt-2">
                <ShowMainPanels />
            </main>
        </Fragment>
    );
}

// n1
function Title() {
    return (
        <>
            <span className="text-title  font-weight-bold">
                App dos
                <br />
                <span className="text-title">Clientes</span>
            </span>
        </>
    );
}

/* COMMENTS
n1: This new syntax for Fragment works well, although the warning for syntax errors
*/
