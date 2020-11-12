import React, { Fragment, useState } from "react";
import SearchCustomer from "./SearchCustomer";
import ScoreCustomer from "./ScoreCustomer";

export default function FieldsHandler() {
    const [curr, setCurr] = useState({
        field: "name",
        customerName: "",
    });
    const { field, customerName } = curr;

    return (
        <Fragment>
            {field === "name" && <SearchCustomer setCurr={setCurr} />}
            {field === "score" && (
                <ScoreCustomer setCurr={setCurr} customerName={customerName} />
            )}
        </Fragment>
    );
}
