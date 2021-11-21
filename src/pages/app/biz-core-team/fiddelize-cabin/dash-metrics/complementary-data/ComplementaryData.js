import { Fragment } from "react";
import AppTotals from "./AppTotals";
import RetentionGraph from "./RetentionGraph";
import ProPlanData from "./ProPlanData";
import AvgTicket from "./AvgTicket";

export default function ComplementaryData({ mainData }) {
    return (
        <Fragment>
            <p className="text-purple text-subtitle font-weight-bold text-center">
                Dados
                <br />
                Complementares
            </p>
            <RetentionGraph mainData={mainData} />
            <AvgTicket mainData={mainData} />
            <ProPlanData mainData={mainData} />
            <AppTotals appTotals={mainData && mainData.appTotals} />
        </Fragment>
    );
}
