import { Fragment } from "react";
import DashSectionTitle from "../../DashSectionTitle";
import ShowConfigExpansiblePanel from "./expansible-panel/ShowExpansiblePanel";
import "./DashAppDesign.scss";

const AppDesignTitle = <Title />;
export default function DashAppDesign() {
    return (
        <Fragment>
            <div style={{ marginTop: "16px", display: "block" }}>
                <DashSectionTitle title={AppDesignTitle} />
            </div>
            <main className="mt-2">
                <ShowConfigExpansiblePanel />
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
