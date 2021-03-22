import { Fragment } from "react";
import AppTotals from "./AppTotals";
import RetentionGraph from "./RetentionGraph";
import ProPlanData from "./ProPlanData";

export default function ComplementaryData({ mainData }) {
    return (
        <Fragment>
            <p className="text-purple text-subtitle font-weight-bold text-center">
                Dados
                <br />
                Complementares
            </p>
            <RetentionGraph mainData={mainData} />
            <ProPlanData mainData={mainData} />
            <AppTotals />
        </Fragment>
    );
}
