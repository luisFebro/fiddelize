import React, { Fragment, useState } from "react";
import SearchCustomer from "./SearchCustomer";
import ScoreCustomer from "./ScoreCustomer";
import SuccessMsg from "./SuccessMsg";
import selectTxtStyle from "../../../../../utils/biz/selectTxtStyle";
import { useClientAdmin } from "../../../../../hooks/useRoleData";

export default function FieldsHandler() {
    const [curr, setCurr] = useState({
        field: "name", // name
        customerName: "",
    });
    const { field, customerName } = curr;

    const {
        selfThemeBackColor: backColor,
        selfThemePColor: colorP,
    } = useClientAdmin();

    const textColor = selectTxtStyle(backColor);
    const needDark = selectTxtStyle(backColor, { needDarkBool: true }); // for icons

    return (
        <Fragment>
            {field === "name" && (
                <SearchCustomer setCurr={setCurr} textColor={textColor} />
            )}
            {field === "score" && (
                <ScoreCustomer
                    setCurr={setCurr}
                    customerName={customerName}
                    textColor={textColor}
                    colorP={colorP}
                />
            )}
            {field === "success" && (
                <SuccessMsg needDark={needDark} textColor={textColor} />
            )}
        </Fragment>
    );
}
