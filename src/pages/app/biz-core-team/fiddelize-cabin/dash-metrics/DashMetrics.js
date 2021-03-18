import DashSectionTitle from "../DashSectionTitle";
import PrimaryMetrics from "./primary-metrics/PrimaryMetrics";
import SecondaryMetrics from "./secondary-metrics/SecondaryMetrics";
import useAPI, { getCabinMainData } from "../../../../../hooks/api/useAPI";
import AppTotals from "./AppTotals";

const getTitle = () => (
    <span className="text-subtitle font-weight-bold">
        IPC
        <br />
        <span
            className="d-inline-block text-subtitle font-weight-bold"
            style={{ lineHeight: "30px" }}
        >
            Indicadores de
            <br />
            Performance-Chave
        </span>
    </span>
);

export default function DashMetrics() {
    const SectionTitle = getTitle();

    const { data, loading } = useAPI({
        url: getCabinMainData(),
        params: {
            period: "monthly",
        },
    });

    const mainData = loading ? {} : data;

    return (
        <div>
            <DashSectionTitle title={SectionTitle} />
            <div className="mt-5" />
            <PrimaryMetrics mainData={mainData} />
            <SecondaryMetrics mainData={mainData} />
            <AppTotals />
        </div>
    );
}
