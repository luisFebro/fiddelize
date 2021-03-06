import { Fragment } from "react";
import "./_Playground.scss";
import useBackColor from "../../hooks/useBackColor";
import OKR from "./range-percentage/OKR";

export default function Playground() {
    useBackColor("var(--mainWhite)");

    return (
        <Fragment>
            <h1 className="mx-3 text-title text-center my-5 text-purple">
                Playground for testing
            </h1>
            <main style={{ marginBottom: 700 }}>
                <OKR />
            </main>
        </Fragment>
    );
}
