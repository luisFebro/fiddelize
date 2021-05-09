import { Fragment, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import SearchCustomer from "./SearchCustomer";
import ScoreCustomer from "./ScoreCustomer";
import SuccessMsg from "./SuccessMsg";
import selectTxtStyle from "../../../../../utils/biz/selectTxtStyle";
import getAPI, { setTempPointsAndMemberData } from "api";
import useData, { useBizData } from "init";

const setCustomerId = async (clientName, bizId, memberId) => {
    const body = {
        needClientIdOnly: true,
        userId: memberId, // for auth token only
        bizId,
        clientName,
    };

    return await getAPI({
        method: "post",
        url: setTempPointsAndMemberData(),
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

    const {
        bizId,
        themeBackColor: backColor,
        themePColor: colorP,
    } = useBizData();
    const [memberId] = useData(["userId"]);

    useEffect(() => {
        if (memberId === "...") return;

        if (customerName && bizId) {
            (async () => {
                const thisCustomerId = await setCustomerId(
                    customerName,
                    bizId,
                    memberId
                );
                setCurr((prev) => ({ ...prev, customerId: thisCustomerId }));
            })();
        }
    }, [customerName, bizId, memberId]);

    const textColor = selectTxtStyle(backColor);
    const needDark = selectTxtStyle(backColor, { needDarkBool: true }); // for icons

    if (clientScoreOnly) {
        return (
            <ScoreCustomer
                clientScoreOnly
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
