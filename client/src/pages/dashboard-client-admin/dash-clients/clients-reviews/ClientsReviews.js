import React from "react";
import Title from "../../../../components/Title";
import NpsReportBtn from "./nps/nps-report/NpsReportBtn";
import XpGradeReportBtn from "./xp-score/xp-report/XpGradeReportBtn";
import BuyReviewsBtn from "./buy-reviews/BuyReviewsBtn";
import colorsHandler from "./helpers/colorsHandler";
import { getTextStatus } from "../../../../components/charts/speedometer-gauge/helpers.js";

export default function ClientsReviews() {
    const nps = -10;
    const xpScore = 10;

    const { colorNPS, backNPS, colorXP, backXP } = colorsHandler({
        nps,
        xpScore,
    });

    const dataStatus = getTextStatus(nps, true);

    const plural = nps !== 1 || nps !== -1 || nps !== 0;
    const showNPS = () => (
        <section
            style={{
                borderRadius: "20px",
                padding: "10px",
                backgroundColor: "var(--mainWhite)",
                minWidth: 175,
            }}
            className="shadow-babadoo position-relative"
        >
            <div
                className="position-absolute text-nowrap"
                style={{
                    top: -20,
                    left: "50%",
                    transform: "translateX(-50%)",
                }}
            >
                <h2 className="text-pill text-center text-subtitle font-weight-bold text-white">
                    Promotores
                </h2>
            </div>
            <p
                className="text-normal font-weight-bold d-block text-center text-purple"
                style={{
                    lineHeight: "25px",
                    margin: "20px 0 0",
                }}
            >
                Métrica de fidelidade
            </p>
            <div className="text-title text-purple text-center">
                <span
                    className={`${colorNPS} d-inline-block font-size text-em-2`}
                >
                    {nps}
                </span>
                <p
                    className={`m-0 ${colorNPS} position-relative text-subtitle font-weight-bold text-center`}
                    style={{ top: -25 }}
                >
                    {plural ? "pontos" : "ponto"}
                </p>
            </div>
            <p
                className={`${backNPS} text-shadow text-center text-subtitle font-weight-bold text-purple d-table text-pill mb-3`}
                style={{ borderRadius: "0px", margin: "0 auto" }}
            >
                {dataStatus && dataStatus.title.toUpperCase()}
            </p>
            <div className="container-center">
                <NpsReportBtn nps={nps} />
            </div>
        </section>
    );

    const showXpGrade = () => (
        <section
            style={{
                borderRadius: "20px",
                padding: "10px",
                backgroundColor: "var(--mainWhite)",
                minWidth: 175,
            }}
            className="position-relative shadow-babadoo"
        >
            <div
                className="position-absolute text-nowrap"
                style={{
                    top: -20,
                    left: "50%",
                    transform: "translateX(-50%)",
                }}
            >
                <h2 className="text-pill text-center text-subtitle font-weight-bold text-white">
                    Nota XP
                </h2>
            </div>
            <p
                className="text-normal font-weight-bold d-block text-center text-purple"
                style={{
                    lineHeight: "25px",
                    margin: "20px 0 0",
                }}
            >
                Experiência de compra
            </p>
            <div className="text-title text-purple text-center">
                <span
                    className={`${colorXP} d-inline-block font-size text-em-2-4`}
                >
                    {xpScore}
                </span>
                <p
                    className={`position-relative text-subtitle font-weight-bold text-center`}
                    style={{ top: -25, visibility: "hidden" }}
                ></p>
            </div>
            <p
                className={`${backXP} text-shadow text-center text-subtitle font-weight-bold text-purple d-table text-pill mb-3`}
                style={{ borderRadius: "0px", margin: "0 auto" }}
            >
                EXCELENTE
            </p>
            <div className="container-center">
                <XpGradeReportBtn xpScore={xpScore} />
            </div>
        </section>
    );

    return (
        <section>
            <Title
                title="&#187; Avaliações dos Clientes"
                color="var(--themeP)"
                margin="my-4"
                padding=" "
            />
            <section className="d-flex justify-content-around mt-5">
                {showNPS()}
                {showXpGrade()}
            </section>
            <section className="my-3">
                <h2 className="text-normal mx-3 mt-5 mb-3 text-center text-purple">
                    O que os clientes estão falando do seu negócio?
                </h2>
                <section className="container-center mt-4">
                    <BuyReviewsBtn />
                </section>
            </section>
        </section>
    );
}
