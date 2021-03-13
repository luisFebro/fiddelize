import { Fragment } from "react";
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

export default function DashGoals({ mainData = {} }) {
    const SectionTitle = getTitle();
    const { allTimeCustomers } = mainData;

    return (
        <Fragment>
            <DashSectionTitle title={SectionTitle} />
            <OKR weeklyNewCustomers={allTimeCustomers} />
        </Fragment>
    );
}
