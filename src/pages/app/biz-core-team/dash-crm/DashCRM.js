import { Fragment } from "react";
import DashSectionTitle from "../fiddelize-cabin/DashSectionTitle";

const getTitle = () => (
    <span className="text-subtitle font-weight-bold">
        CRM
        <br />
        <span
            className="d-inline-block text-subtitle font-weight-bold"
            style={{ lineHeight: "30px" }}
        >
            Gestão do
            <br />
            Relacionamento com clientes
        </span>
    </span>
);

export default function DashCRM() {
    const SectionTitle = getTitle();

    return (
        <Fragment>
            <DashSectionTitle title={SectionTitle} />
        </Fragment>
    );
}
