import { Fragment } from "react";
import DashSectionTitle from "../fiddelize-cabin/DashSectionTitle";

const getTitle = () => (
    <span className="text-subtitle font-weight-bold">
        Suporte Fiddelize
        <br />
        <span
            className="d-inline-block text-subtitle font-weight-bold"
            style={{ lineHeight: "30px" }}
        >
            Centro de suporte para clientes
        </span>
    </span>
);

export default function SupportCenter() {
    const SectionTitle = getTitle();

    return (
        <Fragment>
            <DashSectionTitle title={SectionTitle} />
        </Fragment>
    );
}
