import React, { Fragment } from "react";
import useBackColor from "../../hooks/useBackColor";
import "./_Playground.scss";
// import SpeedometerGauge from "./gauges/speedometer-gauge/SpeedometerGauge"

export default function Playground() {
    useBackColor("var(--mainWhite)");

    return (
        <Fragment>
            <h1 className="text-title text-center my-5 text-purple">
                Playground for testing
            </h1>
            <main
                className="container-center"
                style={{ marginBottom: 700 }}
            ></main>
        </Fragment>
    );
}
