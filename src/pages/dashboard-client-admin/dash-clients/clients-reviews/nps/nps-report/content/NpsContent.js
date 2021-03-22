import { useEffect, useState, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SpeedometerGauge from "../../../../../../../components/charts/speedometer-gauge/SpeedometerGauge";
import colorsHandler from "../../../helpers/colorsHandler";
import { getTextStatus } from "../../../../../../../components/charts/speedometer-gauge/helpers";
import LoadableVisible from "../../../../../../../components/code-splitting/LoadableVisible";
import getAPI, {
    getNpsChartData,
} from "../../../../../../../utils/promises/getAPI";
import useData from "../../../../../../../hooks/useData";
import getWeekDayBr from "../../../../../../../utils/dates/getWeekDayBr";

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

export default function NpsContent({ mainData, isBizAdmin }) {
    const { nps, detractors, promoters } = mainData;

    const { colorNPS } = colorsHandler({ nps });
    const { icon } = getTextStatus(nps);
    const currWeekDay = getWeekDayBr(null, { abbrev: true });

    const { dataChart, loading } = useNpsChartData({
        lastTotalDetractors: detractors && detractors.total,
        lastTotalPromoters: promoters && promoters.total,
        isBizAdmin,
    });

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
                className="m-0 text-small text-purple text-center"
                style={{
                    fontSize: "1.1rem",
                }}
            >
                Promotores são os <strong>fãs do seu negócio</strong>. Quanto
                maior a pontuação, melhor!
            </p>
        </div>
    );

    const plural = nps !== 1 || nps !== -1 || nps !== 0;
    const showScore = () => (
        <div className="position-relative text-title text-purple text-center">
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

    const [chData, setChData] = useState({
        xLabels: "",
        dataArray: "",
    });

    useEffect(() => {
        const { xLabels, dataArray } = getLabelsAndData({
            dataChart,
            currWeekDay,
        });
        setChData({
            xLabels,
            dataArray,
        });
    }, [dataChart, currWeekDay]);

    const showPromotersHistoryChart = () => (
        <section
            className="my-5 position-relative"
            style={{
                top: -100,
            }}
        >
            <AsyncLineChart
                xLabels={chData.xLabels}
                dataArray={chData.dataArray}
                onlySmall
                isMonday={currWeekDay === "Seg"}
                isSunday={currWeekDay === "Dom"}
            />
        </section>
    );

    const showReviewResults = () => (
        <section
            className="position-relative"
            style={{
                top: -100,
                marginBottom: 150,
            }}
        >
            <AsyncReviewResults mainData={mainData} isBizAdmin={isBizAdmin} />
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

function useNpsChartData({
    lastTotalPromoters,
    lastTotalDetractors,
    isBizAdmin,
}) {
    const [data, setData] = useState({
        dataChart: null,
        loading: true,
    });
    const { dataChart, loading } = data;

    const [userId] = useData(["userId"]);

    useEffect(() => {
        const runAnalysis = async () => {
            const params = {
                lastTotalPromoters,
                lastTotalDetractors,
                isBizAdmin,
            };

            const thisChartData = await getAPI({
                url: getNpsChartData(userId),
                params,
            });

            setData((prev) => ({
                ...prev,
                loading: false,
                dataChart: thisChartData && thisChartData.data,
            }));
        };

        if (userId !== "..." && lastTotalPromoters !== undefined) {
            runAnalysis();
        }
    }, [userId, lastTotalPromoters]);

    return { dataChart, loading };
}

function getLabelsAndData({ dataChart, currWeekDay, currNps = 50 }) {
    const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];

    let indCurrWeekDay;
    const finalWeekDay = weekDays.map((w, ind) => {
        if (w === currWeekDay) {
            indCurrWeekDay = ind;
            return "HOJE";
        }
        return w;
    });

    // the rest of data is hidden because all other dates after TODAY is the same like:
    // 62 , 64 (today), 64, 64 ... repeats
    const finalChartData = dataChart
        ? dataChart.slice(0, indCurrWeekDay + 1)
        : [0];

    // be sure that last nps is the same as generated in the mainData
    // sometimes when thereis only detractors and promoters, it will calculate wrongly
    finalChartData.splice(-1, 1, currNps);

    return {
        xLabels: finalWeekDay,
        dataArray: finalChartData,
    };
}
