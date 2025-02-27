import { Fragment } from "react";
import useAPI, { getCabinMainData } from "api/useAPI";
import DashSectionTitle from "../DashSectionTitle";
import OKR from "./objectives-key-results/OKR";

const getTitle = () => (
    <span className="text-subtitle font-weight-bold">
        ORC
        <br />
        <span
            className="d-inline-block text-subtitle font-weight-bold"
            style={{ lineHeight: "30px" }}
        >
            Objetivos e
            <br />
            Resultados-Chave
        </span>
    </span>
);

export default function DashGoals() {
    const SectionTitle = getTitle();

    const { data: weeklyData } = useAPI({
        url: getCabinMainData(),
        params: {
            period: "weekly",
        },
    });

    return (
        <Fragment>
            <DashSectionTitle title={SectionTitle} />
            <OKR weeklyData={weeklyData || {}} />
        </Fragment>
    );
}
