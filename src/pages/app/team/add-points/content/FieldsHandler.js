import { Fragment, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import getAPI, { getUserIdByName } from "api";
import useData, { useBizData } from "init";
import SearchField, { ROOT } from "components/search/SearchField";
import extractStrData from "utils/string/extractStrData";
import AddTempPoints from "./AddTempPoints";
import SuccessMsg from "./SuccessMsg";
import PointsScannerBtn from "./points-scanner/PointsScannerBtn";

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
        isQrCode: false,
    });
    const { field, customerName, customerId, isQrCode } = curr;

    const { bizId, themePColor: colorP, needDark, txtColor } = useBizData();

    const { userId: memberId } = useData();

    useEffect(() => {
        if (customerName && bizId && !isQrCode) {
            (async () => {
                const thisCustomerId = await setCustomerId(
                    customerName,
                    bizId,
                    memberId
                );
                setCurr((prev) => ({ ...prev, customerId: thisCustomerId }));
            })();
        }
    }, [customerName, bizId, memberId, isQrCode]);

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
            field: "points",
            customerName: newVal,
        }));
    };

    const handleScannerValue = (val) => {
        const getScannedId = () => {
            if (!val) return null;
            const VALIDATOR_IND = 24; // length of fiddelize_customer_pts::

            const content = val.slice(VALIDATOR_IND);
            // returns e.g fiddelize_customer_pts::customerId:123;customerName:Luis Febro;
            return extractStrData(content);
        };

        const qrCodeData = getScannedId(val);

        setCurr((prev) => ({
            ...prev,
            isQrCode: true,
            field: "points",
            ...qrCodeData,
        }));
    };

    const showCustomerSearch = () => {
        const autocompleteProps = {
            autoFocus: true,
            placeholder: "",
            noOptionsText: "Cliente não cadastrado",
        };

        return (
            <Fragment>
                <SearchField
                    callback={handleSelectedVal}
                    searchUrl={`${ROOT}/sms/read/contacts?userId=${bizId}&autocomplete=true&autocompleteLimit=7`}
                    autocompleteProps={autocompleteProps}
                />
                <div className="or-scanner position-relative d-flex justify-content-end align-items-center mr-3">
                    <span
                        className={`${txtColor} d-inline-block text-normal font-weight-bold mr-3`}
                    >
                        ou
                    </span>
                    <PointsScannerBtn callback={handleScannerValue} />
                    <style jsx>
                        {`
                            .or-scanner {
                                top: 10px;
                            }
                        `}
                    </style>
                </div>
            </Fragment>
        );
    };

    return (
        <Fragment>
            {field === "name" && (
                <section>
                    <h1
                        className={`animated fadeInUp delay-1s text-center ${txtColor} text-subtitle font-weight-bold`}
                        style={{
                            marginTop: "3rem",
                            marginBottom: "3rem",
                            lineHeight: "30px",
                        }}
                    >
                        Qual é o nome
                        <br />
                        do cliente?
                    </h1>
                    {showCustomerSearch()}
                </section>
            )}
            {field === "points" && (
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
                    customerName={customerName}
                    customerId={customerId}
                />
            )}
        </Fragment>
    );
}
