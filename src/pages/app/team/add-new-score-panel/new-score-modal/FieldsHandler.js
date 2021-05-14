import { Fragment, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import getAPI, { setTempPointsAndMemberData } from "api";
import useData, { useBizData } from "init";
import SearchCustomer from "./SearchCustomer";
import ScoreCustomer from "./ScoreCustomer";
import SuccessMsg from "./SuccessMsg";

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
        needDark,
        txtColor,
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

    if (clientScoreOnly) {
        return (
            <ScoreCustomer
                clientScoreOnly
                closeModal={closeModal}
                handleCustomerScore={handleCustomerScore}
                setCurr={setCurr}
                customerName={customerName || clientName}
                textColor={txtColor}
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
                    textColor={txtColor}
                    bizId={bizId}
                />
            )}
            {field === "score" && (
                <ScoreCustomer
                    setCurr={setCurr}
                    customerName={customerName}
                    textColor={txtColor}
                    colorP={colorP}
                    bizId={bizId}
                    clientId={customerId}
                />
            )}
            {field === "success" && (
                <SuccessMsg
                    needDark={needDark}
                    textColor={txtColor}
                    closeModal={closeModal}
                />
            )}
        </Fragment>
    );
}
