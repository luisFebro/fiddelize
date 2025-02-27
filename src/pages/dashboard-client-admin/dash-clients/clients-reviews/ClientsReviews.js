import { useEffect, useState } from "react";
import getAPI, { getMainReviewData } from "api";
import useData, { useBizData } from "init";
import Title from "components/Title";
import getVar, { setVar } from "init/var";
import { getTextStatus } from "components/charts/speedometer-gauge/helpers";
import NpsReportBtn from "./nps/nps-report/NpsReportBtn";
import XpGradeReportBtn from "./xp-score/xp-report/XpGradeReportBtn";
import BuyReviewsBtn from "./buy-reviews/BuyReviewsBtn";
import colorsHandler from "./helpers/colorsHandler";
import { getGradeText, getColorGrade } from "./xp-score/helpers";
import "./_ClientsReviews.scss";

export default function ClientsReviews() {
    const [dataScore, setDataScore] = useState({
        xpScoreDiff: 0,
        lastXpStatus: "",
    });

    const { countCliUsers } = useBizData();

    const { xpScoreDiff, lastXpStatus } = dataScore;
    const { mainData, loading } = useMainReviewData();
    const {
        nps = "...",
        xpScore = "...",
        uncheckedReviews = "...",
        lastDateChecked,
        npsScoreDiff,
    } = mainData;

    useEffect(() => {
        if (xpScore === "..." || !xpScore) return;
        (async () => {
            const lastXpScore = await getVar("lastXpScore");
            if (!lastXpScore) {
                await setVar({ lastXpScore: xpScore });
                return;
            }

            const thisXpScoreDiff = handleIntOrFloat(xpScore - lastXpScore);
            const thisLastXpStatus = handleLastXpStatus(thisXpScoreDiff);
            await setDataScore({
                xpScoreDiff: thisXpScoreDiff,
                lastXpStatus: thisLastXpStatus,
            });

            if (lastXpScore !== xpScore) {
                await setVar({ lastXpScore: xpScore });
            }
        })();
    }, [xpScore]);

    const { colorNPS, backNPS } = colorsHandler({
        nps,
        countCliUsers,
        // xpScore,
    });

    const dataStatus =
        countCliUsers === 0 ? { title: "SEM" } : getTextStatus(nps, true);

    const plural = nps !== 1 || nps !== -1 || nps !== 0;
    const colorNPSDiff = npsScoreDiff > 0 ? "text-sys-green" : "text-red";
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
                    className={`${colorNPSDiff} text-normal font-weight-bold position-absolute`}
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
                <NpsReportBtn mainData={mainData} disabled={!!loading} />
            </div>
        </section>
    );

    let gradeTextXp = getGradeText(xpScore);
    gradeTextXp = gradeTextXp === "Precário" && !xpScore ? "Sem" : gradeTextXp;
    const colorXP = getColorGrade(xpScore);

    const xpPayload = {
        xpScore,
        xpScoreDiff,
        lastXpStatus, // up, down, same
    };

    const colorXPDiff = xpScoreDiff > 0 ? "text-sys-green" : "text-red";
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
            <div className="position-relative text-title text-purple text-center">
                <p
                    className={`${colorXPDiff} text-normal font-weight-bold position-absolute`}
                    style={{
                        top: -3,
                        right: 15,
                    }}
                >
                    {handleScoreDiff(xpScoreDiff)}
                </p>
                <span
                    className={`${
                        !xpScore ? "text-purple" : colorXP
                    } d-inline-block font-size text-em-2-4`}
                >
                    {xpScore}
                </span>
                <p
                    className="position-relative text-subtitle font-weight-bold text-center"
                    style={{ top: -25, visibility: "hidden" }}
                />
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
                <XpGradeReportBtn payload={xpPayload} disabled={!!loading} />
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
                timeout: 30000,
            });
            if (!thisMainData) return null;

            // for min security in backend customer base
            await setVar({
                polls: { xp: thisMainData.xpScore, nps: thisMainData.nps },
            });

            return setData((prev) => ({
                ...prev,
                loading: false,
                mainData: thisMainData,
            }));
        };
        userId !== "..." && runAnalysis();
    }, [userId]);

    return { mainData, loading };
}

// HELPERS
function handleScoreDiff(scoreDiff) {
    if (scoreDiff === 0) return "";
    if (scoreDiff > 0) return `+${scoreDiff}`;
    return scoreDiff;
}

// for xpScoreDiff
function handleIntOrFloat(num) {
    if (Number.isNaN(num)) return 0;
    return Number.isInteger(num) ? num : Number(num.toFixed(1));
}

function handleLastXpStatus(diffScore) {
    if (diffScore === 0) return "same";
    if (diffScore < 0) {
        return "down";
    }
    return "up";
}
