import { Fragment, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import getAPI, { getUserIdByName } from "api";
import useData, { useBizData } from "init";
import SearchField, { ROOT } from "components/search/SearchField";
import { getScannedData } from "hooks/media/useQrScanner";
import getColor from "styles/txt";
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

const defaultCurrData = {
    field: "name",
    customerName: "",
    customerId: "",
    isQrCode: false,
};

function FieldsHandler({
    closeModal,
    clientScoreOnly = false,
    clientName,
    handleCustomerScore,
}) {
    const [curr, setCurr] = useState(defaultCurrData);

    useEffect(() => {
        // make sure data is new every time the dialog is entered because when using qr code, the data is preserved and force skipping searching a new name
        setCurr(defaultCurrData);
    }, []);

    const { field, customerName, customerId, isQrCode } = curr;

    const { bizId, themePColor: colorP, themeBackColor } = useBizData();
    const { needDark, txtColor } = getColor(themeBackColor);

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

    const handleScannedVal = (val) => {
        const qrCodeData = getScannedData(val);

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
                    <PointsScannerBtn callback={handleScannedVal} />
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
