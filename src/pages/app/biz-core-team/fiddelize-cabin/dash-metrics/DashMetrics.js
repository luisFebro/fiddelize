import DashSectionTitle from "../DashSectionTitle";
import PrimaryMetrics from "./primary-metrics/PrimaryMetrics";
import SecondaryMetrics from "./secondary-metrics/SecondaryMetrics";

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

export default function DashMetrics({ mainData = {} }) {
    const SectionTitle = getTitle();

    return (
        <div>
            <DashSectionTitle title={SectionTitle} />
            <div className="mt-5" />
            <PrimaryMetrics />
            <SecondaryMetrics mainData={mainData} />
        </div>
    );
}
