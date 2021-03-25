import getPercentage from "../../../../../../utils/numbers/getPercentage";
import colorsHandler from "../../../../../dashboard-client-admin/dash-clients/clients-reviews/helpers/colorsHandler";
import NpsReportBtn from "../../../../../dashboard-client-admin/dash-clients/clients-reviews/nps/nps-report/NpsReportBtn";
import { getTextStatus } from "../../../../../../components/charts/speedometer-gauge/helpers";
import XpReports from "./XpReports";
import ConversionRateReportBtn from "./conversion-rate-report/ConversionRateReportBtn";

export default function SecondaryMetrics({ mainData }) {
    return (
        <section>
            <p className="text-purple text-subtitle font-weight-bold text-center">
                Indicadores
                <br />
                Secundários
            </p>
            <section className="d-flex justify-content-around mt-5">
                <NPS mainData={mainData} />
                <ConversionRate mainData={mainData} />
            </section>
            <br />
            <XpReports mainData={mainData} />
        </section>
    );
}

// HELPERS
function handleScoreDiff(scoreDiff) {
    if (scoreDiff === 0) return "";
    if (scoreDiff > 0) return `+${scoreDiff}`;
    return scoreDiff;
}
// END HELPERS

function NPS({ mainData }) {
    // const { false } = useMainReviewData();

    const { nps = "...", npsScoreDiff } = mainData;
    const loading = Boolean(!nps && nps !== 0);

    const { colorNPS, backNPS } = colorsHandler({
        nps,
    });

    const dataStatus = getTextStatus(nps, true);

    const plural = nps !== 1 || nps !== -1 || nps !== 0;
    const colorNPSDiff = npsScoreDiff > 0 ? "text-sys-green" : "text-red";

    return (
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
                {false && (
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
                    disabled={!!loading}
                    isBizAdmin
                />
            </div>
        </section>
    );
}

function ConversionRate({ mainData }) {
    const { proCustomersCount, customersCount, freeCustomersCount } = mainData;

    const loading = false;
    const percProCustomers = getPercentage(customersCount, proCustomersCount);
    const percFreeCustomers = getPercentage(customersCount, freeCustomersCount);
    const plural = true;
    // const percFreeCustomers = getPercentage(customersCount, allTimeFreeCustomers);

    const colorConversionRate = "green";

    const { color, status, backColor } = getColorConversionData(
        percProCustomers
    );

    return (
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
                    Clientes
                </h2>
            </div>
            <p
                className="text-normal font-weight-bold d-block text-center text-purple"
                style={{
                    lineHeight: "25px",
                    margin: "20px 0 0",
                }}
            >
                Taxa de Conversão
            </p>
            <div className="position-relative text-title text-purple text-center">
                <p
                    className={`${colorConversionRate} text-normal font-weight-bold position-absolute`}
                    style={{
                        top: -3,
                        right: 15,
                    }}
                >
                    {handleScoreDiff(null)}
                </p>
                <span className={`${color} d-inline-block font-size text-em-2`}>
                    {percProCustomers}
                    <span className="text-em-0-6">%</span>
                </span>
                {false && (
                    <p
                        className={`m-0 ${color} position-relative text-subtitle font-weight-bold text-center`}
                        style={{ top: -25 }}
                    >
                        {plural ? "clientes" : "cliente"}
                    </p>
                )}
            </div>
            <p
                className={`${backColor} text-shadow text-center text-subtitle font-weight-bold text-purple d-table text-pill mb-3`}
                style={{ borderRadius: "0px", margin: "0 auto" }}
            >
                {status}
            </p>
            <div className="container-center">
                <ConversionRateReportBtn
                    mainData={mainData}
                    disabled={!!loading}
                    percFreeCustomers={percFreeCustomers}
                    percProCustomers={percProCustomers}
                />
            </div>
        </section>
    );
}

function getColorConversionData(value) {
    if (value <= 0 && value < 5)
        return {
            color: "text-red",
            backColor: "theme-back--red",
            status: "RUIM",
        };
    if (value >= 5 && value < 10)
        return {
            color: "text-yellow",
            backColor: "theme-back--yellow",
            status: "BOM",
        };
    if (value >= 10 && value < 15)
        return {
            color: "text-alt-green",
            backColor: "theme-back--green",
            status: "ÓTIMO",
        };
    if (value >= 15)
        return {
            color: "text-sys-green",
            backColor: "theme-back--green",
            status: "EXCELENTE",
        };

    return;
}
