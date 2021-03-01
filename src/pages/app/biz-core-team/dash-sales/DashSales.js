import { Fragment } from "react";
import Balance from "./balance/Balance";
import IncomeExplanation from "./IncomeExplanation";
import IncomeHistory from "./income-history/IncomeHistory";

export default function DashSales() {
    return (
        <Fragment>
            <Balance />
            <IncomeExplanation />
            <IncomeHistory />
        </Fragment>
    );
}
