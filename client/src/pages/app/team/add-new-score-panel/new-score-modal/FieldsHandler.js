import React, { Fragment, useState, useEffect } from "react";
import SearchCustomer from "./SearchCustomer";
import ScoreCustomer from "./ScoreCustomer";
import SuccessMsg from "./SuccessMsg";
import selectTxtStyle from "../../../../../utils/biz/selectTxtStyle";
import { useClientAdmin, useAppSystem } from "../../../../../hooks/useRoleData";
import getAPI, {
    setTempScoreAndMemberData,
} from "../../../../../utils/promises/getAPI";
import useAuth from "../../../../../hooks/useAuthUser";
import { withRouter } from "react-router-dom";
import useData from "../../../../../hooks/useData";

const setCustomerId = async (clientName, bizId, memberId) => {
    const body = {
        needClientIdOnly: true,
        userId: memberId, // for auth token only
        bizId,
        clientName,
    };

    return await getAPI({
        method: "post",
        url: setTempScoreAndMemberData(),
        body,
    });
};

export default withRouter(FieldsHandler);

function FieldsHandler({
    history,
    closeModal,
    clientScoreOnly = false,
    clientName,
    handleCustomerScore,
}) {
    const [curr, setCurr] = useState({
        field: "name", // name
        customerName: "",
        customerId: "",
    });
    const { field, customerName, customerId } = curr;

    const { businessId: bizId } = useAppSystem();
    const [memberId] = useData(["userId"]);

    // useAuth({ history });

    useEffect(() => {
        if (memberId === "...") return;

        if (customerName && bizId) {
            (async () => {
                const { data: thisCustomerId } = await setCustomerId(
                    customerName,
                    bizId,
                    memberId
                );
                setCurr((prev) => ({ ...prev, customerId: thisCustomerId }));
            })();
        }
    }, [customerName, bizId, memberId]);

    const {
        selfThemeBackColor: backColor,
        selfThemePColor: colorP,
    } = useClientAdmin();

    const textColor = selectTxtStyle(backColor);
    const needDark = selectTxtStyle(backColor, { needDarkBool: true }); // for icons

    if (clientScoreOnly) {
        return (
            <ScoreCustomer
                clientScoreOnly={true}
                closeModal={closeModal}
                handleCustomerScore={handleCustomerScore}
                setCurr={setCurr}
                customerName={customerName || clientName}
                textColor={textColor}
                colorP={colorP}
                bizId={bizId}
                clientId={customerId}
            />
        );
    }

    return (
        <Fragment>
            {field === "name" && (
                <SearchCustomer
                    setCurr={setCurr}
                    textColor={textColor}
                    bizId={bizId}
                />
            )}
            {field === "score" && (
                <ScoreCustomer
                    setCurr={setCurr}
                    customerName={customerName}
                    textColor={textColor}
                    colorP={colorP}
                    bizId={bizId}
                    clientId={customerId}
                />
            )}
            {field === "success" && (
                <SuccessMsg
                    needDark={needDark}
                    textColor={textColor}
                    closeModal={closeModal}
                />
            )}
        </Fragment>
    );
}
