import React, { Fragment } from "react";
import SpeedometerGauge from "../../../../../../../components/charts/speedometer-gauge/SpeedometerGauge";
import colorsHandler from "../../../helpers/colorsHandler";
import { getTextStatus } from "../../../../../../../components/charts/speedometer-gauge/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadableVisible from "../../../../../../../components/code-splitting/LoadableVisible";

const isSmall = window.Helper.isSmallScreen();

const AsyncLineChart = LoadableVisible({
    loader: () =>
        import(
            "../../../../../../../components/charts/line-chart/LineChart" /* webpackChunkName: "line-chart-comp-lazy" */
        ),
});

const AsyncReviewResults = LoadableVisible({
    loader: () =>
        import(
            "../../review-results-faq/ReviewResults" /* webpackChunkName: "review-nps-res-comp-lazy" */
        ),
});

export default function NpsContent({ mainData }) {
    const { nps } = mainData;

    const { colorNPS } = colorsHandler({ nps });
    const { icon } = getTextStatus(nps);

    const showTitle = () => (
        <div className="my-4">
            <h1
                className="text-subtitle text-purple text-center font-weight-bold"
                style={{ lineHeight: "30px" }}
            >
                Pontuação
                <br />
                Promotores
            </h1>
            <p
                className="text-small text-purple text-center"
                style={{
                    fontSize: "1.1rem",
                }}
            >
                Promotores são os <strong>fãs do seu negócio</strong>. Quanto
                maior a pontuação, mais clientes satisfeitos querendo comprar
                mais!
            </p>
        </div>
    );

    const plural = nps !== 1 || nps !== -1 || nps !== 0;
    const showScore = () => (
        <div className="position-relative my-2 text-title text-purple text-center">
            <span
                className={`${colorNPS} d-inline-block font-size text-em-2-1`}
            >
                {nps}
            </span>
            <p
                className={`m-0 ${colorNPS} position-relative text-subtitle font-weight-bold text-center`}
                style={{ top: -25 }}
            >
                {plural ? "pontos" : "ponto"}
            </p>
            <div
                className="position-absolute"
                style={{
                    right: isSmall ? 40 : 70,
                    top: 25,
                }}
            >
                <FontAwesomeIcon
                    icon={icon}
                    className={colorNPS}
                    style={{ fontSize: "4rem" }}
                />
            </div>
        </div>
    );

    const showPromotersHistoryChart = () => {
        const xLabels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
        const dataArray = ["0", 100, 1, 40, -30, 20, 90];

        return (
            <section
                className="my-5 position-relative"
                style={{
                    top: -100,
                }}
            >
                <AsyncLineChart
                    xLabels={xLabels}
                    dataArray={dataArray}
                    onlySmall={true}
                />
            </section>
        );
    };

    const showReviewResults = () => (
        <section
            className="position-relative"
            style={{
                top: -100,
                marginBottom: 150,
            }}
        >
            <AsyncReviewResults mainData={mainData} />
        </section>
    );

    return (
        <Fragment>
            <section className="mx-3">
                {showTitle()}
                {showScore()}
                <section className="container-center">
                    <SpeedometerGauge value={nps} />
                </section>
            </section>
            {showPromotersHistoryChart()}
            {showReviewResults()}
        </Fragment>
    );
}
