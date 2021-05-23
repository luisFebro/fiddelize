import { Fragment, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import getAPI, { getUserIdByName } from "api";
import useData, { useBizData } from "init";
import SearchField, { ROOT } from "components/search/SearchField";
import AddTempPoints from "./AddTempPoints";
import SuccessMsg from "./SuccessMsg";

const setCustomerId = async (clientName, bizId, memberId) => {
    const params = {
        userId: memberId, // for auth token only
        bizId,
        clientName,
    };

    return await getAPI({
        url: getUserIdByName(),
        params,
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

    const { bizId, themePColor: colorP, needDark, txtColor } = useBizData();

    const { userId: memberId } = useData();

    useEffect(() => {
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
            <AddTempPoints
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

    const handleSelectedVal = (newVal) => {
        setCurr((prev) => ({
            ...prev,
            field: "score",
            customerName: newVal,
        }));
    };

    const autocompleteProps = {
        autoFocus: true,
        placeholder: "",
        noOptionsText: "Cliente não cadastrado",
    };

    return (
        <Fragment>
            {field === "name" && (
                <section>
                    <h1
                        className={`animated fadeInUp delay-1s text-center ${txtColor} text-subtitle font-weight-bold`}
                        style={{
                            marginTop: "1rem",
                            marginBottom: "4rem",
                            lineHeight: "30px",
                        }}
                    >
                        Qual é o nome
                        <br />
                        do cliente?
                    </h1>
                    <SearchField
                        callback={handleSelectedVal}
                        searchUrl={`${ROOT}/sms/read/contacts?userId=${bizId}&autocomplete=true&autocompleteLimit=7`}
                        autocompleteProps={autocompleteProps}
                    />
                </section>
            )}
            {field === "score" && (
                <AddTempPoints
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
