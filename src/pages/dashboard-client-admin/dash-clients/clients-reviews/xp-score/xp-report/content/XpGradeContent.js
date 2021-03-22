import { Fragment, useState, useEffect } from "react";
import parse from "html-react-parser";
import getAPI, {
    getXpScoreChartData,
} from "../../../../../../../utils/promises/getAPI";
import useData from "../../../../../../../hooks/useData";
import { getGradeText, getColorGrade } from "../../helpers";
import "../../../_ClientsReviews.scss";
import FaqXpScore from "./FaqXpScore";
import LoadableVisible from "../../../../../../../components/code-splitting/LoadableVisible";

const AsyncBarChart = LoadableVisible({
    loader: () =>
        import(
            "../../../../../../../components/charts/bar-chart/BarChart" /* webpackChunkName: "bar-chart-comp-lazy" */
        ),
});

export default function XpGradeContent({ payload = {} }) {
    const {
        xpScore = 9.2,
        xpScoreDiff = 0.5,
        lastXpStatus = "up", // up, down, same
    } = payload;

    const { dataChart, loading } = useXpScoreChartData();

    const xpDiffStatus = getXpDiffStatus({
        scoreDiff: xpScoreDiff,
        status: lastXpStatus,
    });

    let gradeTextXp = getGradeText(xpScore);
    gradeTextXp = gradeTextXp === "Precário" && !xpScore ? "Sem" : gradeTextXp;
    const colorXP = getColorGrade(xpScore);

    const showResearch = () => (
        <section className="text-purple my-5">
            <h2 className="text-subtitle text-center font-weight-bold">
                Pesquisa Realizada
            </h2>
            <p className="text-normal text-center mx-3">
                Qual foi sua experiência de compra?
            </p>
        </section>
    );

    const showBarChart = () => {
        const xLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
        const dataArray = dataChart;
        const title = "Qtde. clientes e suas notas XP";
        return (
            !loading && (
                <AsyncBarChart
                    xLabels={xLabels}
                    title={title}
                    dataArray={dataArray}
                    axisYTitle="clientes"
                    axisXTitle="notas"
                />
            )
        );
    };

    const showTitle = () => (
        <div className="my-4">
            <h1
                className="text-subtitle text-purple text-center font-weight-bold"
                style={{ lineHeight: "30px" }}
            >
                Nota XP
            </h1>
            <p
                className="text-small text-purple text-center"
                style={{
                    fontSize: "1.1rem",
                }}
            >
                A nota XP é a média geral da{" "}
                <strong>experiência de compra</strong> avaliada por todos seus
                clientes. O objetivo é manter uma nota acima de 6.
            </p>
        </div>
    );

    return (
        <Fragment>
            <section className="mx-3">{showTitle()}</section>
            <div className="text-center clients-reviews--root">
                <h2 className={`${colorXP} font-site text-em-5`}>{xpScore}</h2>
                <p
                    className={`${colorXP}-back text-shadow text-center text-subtitle font-weight-bold text-purple d-table text-pill mb-3`}
                    style={{ borderRadius: "0px", margin: "0 auto" }}
                >
                    {gradeTextXp && gradeTextXp.toUpperCase()}
                </p>
                <p className="text-normal">{xpDiffStatus}</p>
            </div>
            {showResearch()}
            {showBarChart()}
            <section className="my-5">
                <FaqXpScore />
            </section>
        </Fragment>
    );
}

function useXpScoreChartData() {
    const [data, setData] = useState({
        dataChart: null,
        loading: true,
    });
    const { dataChart, loading } = data;

    const [userId] = useData(["userId"]);

    useEffect(() => {
        const runAnalysis = async () => {
            const thisChartData = await getAPI({
                url: getXpScoreChartData(userId),
            });
            if (!thisChartData) return;

            setData((prev) => ({
                ...prev,
                loading: false,
                dataChart: thisChartData.data,
            }));
        };
        userId !== "..." && runAnalysis();
    }, [userId]);

    return { dataChart, loading };
}

// Lesson: parse should be the wrapper of all text, not inside of it. Otherwise [Object object] returns as result
function getXpDiffStatus({ scoreDiff, status }) {
    if (status === "up") {
        const greenScore = `<span class="text-sys-green text-subtitle font-weight-bold">+${scoreDiff}</span>`;
        return parse(`nota aumentou ${greenScore}<br />desde último acesso`);
    }
    if (status === "down") {
        const redScore = `<span class="text-red text-subtitle font-weight-bold">${scoreDiff}</span>`;
        return parse(`diminuiu ${redScore}<br />desde último acesso`);
    }
    if (status === "same") {
        return parse(
            'a nota é a <span class="text-grey font-weight-bold">mesma</span><br />desde último acesso'
        );
    }
}
