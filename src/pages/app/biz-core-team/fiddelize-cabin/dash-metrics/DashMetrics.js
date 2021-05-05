import { Fragment } from "react";
import useAPI, { getCabinMainData } from "api/useAPI";
import DashSectionTitle from "../DashSectionTitle";
import PrimaryMetrics from "./primary-metrics/PrimaryMetrics";
import SecondaryMetrics from "./secondary-metrics/SecondaryMetrics";
import ComplementaryData from "./complementary-data/ComplementaryData";

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
            period: "all",
        },
        timeout: 30000,
    });

    let mainData = loading ? {} : data;
    if (mainData === "null") {
        mainData = {};
    }

    return (
        <Fragment>
            <div className="mt-3" />
            <DashSectionTitle title={SectionTitle} />
            <div className="mt-5" />
            <PrimaryMetrics mainData={mainData} />
            <SecondaryMetrics mainData={mainData} />
            <div style={{ marginBottom: 100 }} />
            <ComplementaryData mainData={mainData} />
            <div style={{ marginBottom: 100 }} />
        </Fragment>
    );
}
