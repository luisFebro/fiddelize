import { Fragment } from "react";
import Balance from "./balance/Balance";
import IncomeExplanation from "./IncomeExplanation";
import IncomeHistory from "./income-history/IncomeHistory";
import PixKeyRequest from "./pix-key-request/PixKeyRequest";

export default function DashSales() {
    return (
        <Fragment>
            <Balance />
            <IncomeExplanation />
            <PixKeyRequest />
            <IncomeHistory />
        </Fragment>
    );
}
