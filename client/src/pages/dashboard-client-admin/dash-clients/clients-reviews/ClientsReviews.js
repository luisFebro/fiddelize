import React, { useEffect, useState } from "react";
import Title from "../../../../components/Title";
import NpsReportBtn from "./nps/nps-report/NpsReportBtn";
import XpGradeReportBtn from "./xp-score/xp-report/XpGradeReportBtn";
import BuyReviewsBtn from "./buy-reviews/BuyReviewsBtn";
import colorsHandler from "./helpers/colorsHandler";
import { getTextStatus } from "../../../../components/charts/speedometer-gauge/helpers.js";
import getAPI, { getMainReviewData } from "../../../../utils/promises/getAPI";
import useData from "../../../../hooks/useData";
import { getGradeText, getColorGrade } from "./xp-score/helpers";
import "./_ClientsReviews.scss";

export default function ClientsReviews() {
    const { mainData, loading } = useMainReviewData();
    const {
        nps = "...",
        xpScore = "...",
        uncheckedReviews = "...",
        lastDateChecked,
        npsScoreDiff,
    } = mainData;

    const { colorNPS, backNPS } = colorsHandler({
        nps,
        xpScore,
    });

    const dataStatus = getTextStatus(nps, true);

    const plural = nps !== 1 || nps !== -1 || nps !== 0;
    const scoreDiffColor = npsScoreDiff > 0 ? "text-sys-green" : "text-red";
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
            <div className="position-relative text-title text-purple text-center">
                <p
                    className={`${scoreDiffColor} text-normal font-weight-bold position-absolute`}
                    style={{
                        top: -3,
                        right: 15,
                    }}
                >
                    {handleScoreDiff(npsScoreDiff)}
                </p>
                <span
                    className={`${colorNPS} d-inline-block font-size text-em-2`}
                >
                    {nps}
                </span>
                {!loading && (
                    <p
                        className={`m-0 ${colorNPS} position-relative text-subtitle font-weight-bold text-center`}
                        style={{ top: -25 }}
                    >
                        {plural ? "pontos" : "ponto"}
                    </p>
                )}
            </div>
            <p
                className={`${backNPS} text-shadow text-center text-subtitle font-weight-bold text-purple d-table text-pill mb-3`}
                style={{ borderRadius: "0px", margin: "0 auto" }}
            >
                {dataStatus && dataStatus.title.toUpperCase()}
            </p>
            <div className="container-center">
                <NpsReportBtn
                    mainData={mainData}
                    disabled={loading ? true : false}
                />
            </div>
        </section>
    );

    let gradeTextXp = getGradeText(xpScore);
    gradeTextXp = gradeTextXp === "Precário" && !xpScore ? "Sem" : gradeTextXp;
    const colorXP = getColorGrade(xpScore);
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
                    className={`${
                        !xpScore ? "text-purple" : colorXP
                    } d-inline-block font-size text-em-2-4`}
                >
                    {xpScore}
                </span>
                <p
                    className={`position-relative text-subtitle font-weight-bold text-center`}
                    style={{ top: -25, visibility: "hidden" }}
                ></p>
            </div>
            {!loading && (
                <p
                    className={`${colorXP}-back text-shadow text-center text-subtitle font-weight-bold text-purple d-table text-pill mb-3`}
                    style={{ borderRadius: "0px", margin: "0 auto" }}
                >
                    {gradeTextXp && gradeTextXp.toUpperCase()}
                </p>
            )}
            <div className="container-center">
                <XpGradeReportBtn
                    xpScore={xpScore}
                    disabled={loading ? true : false}
                />
            </div>
        </section>
    );

    const pluralReviews = uncheckedReviews > 1 ? "s" : "";
    return (
        <section className="clients-reviews--root">
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
                <h2 className="text-normal font-weight-bold mx-3 mt-5 mb-3 text-center text-purple">
                    O que os clientes estão falando do seu negócio?
                </h2>
                <p className="my-2 text-normal text-purple text-center">
                    <span
                        className={`d-inline-block text-hero ${
                            uncheckedReviews !== "..." && uncheckedReviews > 0
                                ? "animated bounce delay-2s repeat-2"
                                : ""
                        }`}
                    >
                        {uncheckedReviews}
                    </span>{" "}
                    relato{pluralReviews}
                    <br />
                    não lido{pluralReviews}
                </p>
                <section className="container-center mt-4">
                    <BuyReviewsBtn lastDateChecked={lastDateChecked} />
                </section>
            </section>
        </section>
    );
}

function useMainReviewData() {
    const [data, setData] = useState({
        mainData: {},
        loading: true,
    });
    const { mainData, loading } = data;

    const [userId] = useData(["userId"]);

    useEffect(() => {
        const runAnalysis = async () => {
            const thisMainData = await getAPI({
                url: getMainReviewData(userId),
            });

            setData((prev) => ({
                ...prev,
                loading: false,
                mainData: thisMainData && thisMainData.data,
            }));
        };
        userId !== "..." && runAnalysis();
    }, [userId]);

    return { mainData, loading };
}

// HELPERS
function handleScoreDiff(npsScoreDiff) {
    if (npsScoreDiff === 0) return "";
    if (npsScoreDiff > 0) return `+${npsScoreDiff}`;
    return npsScoreDiff;
}
