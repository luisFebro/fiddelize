import { Fragment, useState } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import { withRouter } from "react-router-dom";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import LoadableVisible from "components/code-splitting/LoadableVisible";
import copyTextToClipboard from "utils/document/copyTextToClipboard";
import setProRenewal from "utils/biz/setProRenewal";
import showToast from "components/toasts";
import { isScheduledDate } from "utils/dates/dateFns";
import extractStrData from "utils/string/extractStrData";

const AsyncOrdersTableContent = LoadableVisible({
    loader: () =>
        import(
            "pages/plans-page/orders-and-pay/OrdersTableContent" /* webpackChunkName: "orders-table-content-comp-lazy" */
        ),
});

const AsyncPixDetails = LoadableVisible({
    loader: () =>
        import(
            "./pix-details-pay/AsyncPixDetails" /* webpackChunkName: "pix-details-pay-comp-lazy" */
        ),
});

PanelHiddenContent.propTypes = {
    data: PropTypes.object.isRequired,
};

const getStyles = () => ({
    pointsContainer: {
        position: "relative",
    },
    fieldFormValue: {
        backgroundColor: "#fff",
        color: "var(--themeP)",
        fontSize: "20px",
        fontWeight: "bold",
        fontFamily: "var(--mainFont)",
    },
});

function PanelHiddenContent({ history, data }) {
    const [copy, setCopy] = useState(false);
    const [loadingOrderPage, setLoadingOrderPage] = useState(false);

    const isDuePay =
        !isScheduledDate(data.payDueDate, { isDashed: true }) &&
        data.transactionStatus !== "pago"; // for boleto

    const styles = getStyles();

    const displayCopyBtn = () => (
        <section className="d-flex justify-content-end my-3">
            <ButtonFab
                size="medium"
                title="Copiar"
                onClick={handleCopy}
                backgroundColor="var(--themeSDark--default)"
                variant="extended"
            />
        </section>
    );

    const handleCopy = () => {
        setCopy(true);
        showToast("Linha Copiada! Use no App do seu banco favorito.", {
            type: "success",
        });
        setTimeout(
            () => copyTextToClipboard("#barcodeLineArea", () => null),
            3000
        );
    };

    const showBarcodeLine = (data) => (
        <Fragment>
            {!copy ? (
                <Fragment>{data.barcode}</Fragment>
            ) : (
                <TextField
                    multiline
                    rows={2}
                    id="barcodeLineArea"
                    name="message"
                    InputProps={{
                        style: styles.fieldFormValue,
                    }}
                    value={data.barcode}
                    variant="outlined"
                    fullWidth
                />
            )}
        </Fragment>
    );

    const showBoletoDetails = (data) => (
        <Fragment>
            {isDuePay ||
                (data.transactionStatus !== "pago" && (
                    <Fragment>
                        <section className="mt-4 text-normal text-break font-weight-bold text-shadow">
                            <div className="d-flex">
                                <p className="align-items-center mr-4 text-subtitle font-weight-bold text-white text-shadow text-center">
                                    • Linha:
                                </p>
                                <ButtonFab
                                    position="relative"
                                    size="small"
                                    title="copiar"
                                    onClick={handleCopy}
                                    backgroundColor="var(--themeSDark--default)"
                                    variant="extended"
                                />
                            </div>
                            {showBarcodeLine(data)}
                        </section>
                        <section className="mt-4 mb-5 container-center">
                            <a
                                rel="noopener noreferrer"
                                className="no-text-decoration"
                                href={data.paymentLink}
                                target="_blank"
                            >
                                <ButtonFab
                                    position="relative"
                                    size="medium"
                                    title="Abrir Boleto"
                                    onClick={null}
                                    backgroundColor="var(--themeSDark--default)"
                                    variant="extended"
                                />
                            </a>
                        </section>
                    </Fragment>
                ))}
        </Fragment>
    );

    const showBankDebitDetails = (data) => (
        <section className="mt-4 mb-5 container-center">
            <a
                rel="noopener noreferrer"
                className="no-text-decoration"
                href={data.paymentLink}
                target="_blank"
            >
                <ButtonFab
                    position="relative"
                    size="medium"
                    title="Acessar Banco"
                    onClick={null}
                    backgroundColor="var(--themeSDark--default)"
                    variant="extended"
                />
            </a>
        </section>
    );

    const showCreditCardDetails = (data) => {
        const { paymentDetails } = data;
        const { installmentDesc } = extractStrData(paymentDetails);

        return (
            <section className="mt-4">
                <p className="text-normal font-weight-bold text-white text-shadow text-left">
                    • Investimento {installmentDesc}
                </p>
            </section>
        );
    };

    const showPixDetails = (data) => (
        <AsyncPixDetails itemAmount={data.investAmount} />
    );

    const showPayDetails = () => {
        const payMethod = data.paymentMethod;

        const isBoleto = payMethod === "boleto";
        const isBankDebit = payMethod === "débito bancário";
        const isCreditCard = payMethod === "cartão crédito";
        const isPix = payMethod === "pix";

        return (
            <section className="mt-4 mb-5">
                <h2 className="mb-2 text-subtitle font-weight-bold text-white text-shadow text-center">
                    Detalhes Transação
                </h2>
                <p className="text-subtitle font-weight-bold text-shadow">
                    • Referência:
                    <span className="d-block text-normal font-weight-bold">
                        {data.reference}
                    </span>
                    {isBoleto && showBoletoDetails(data)}
                    {isBankDebit && showBankDebitDetails(data)}
                    {isCreditCard && showCreditCardDetails(data)}
                    {isPix && showPixDetails(data)}
                </p>
            </section>
        );
    };

    const showInvestExtract = () => {
        const {
            itemList: orders,
            investAmount,
            reference,
            renewal,
            transactionStatus,
        } = data;
        const isRenewable =
            transactionStatus &&
            transactionStatus !== "pendente" &&
            (renewal && renewal.priorRef) !== reference;
        const referenceArray = reference && reference.split("-");
        const [planCode, , period] = referenceArray;

        const thisPlan = getPlanCodeBr(planCode);
        const thisPeriod = period === "A" ? "yearly" : "monthly";

        return (
            <Fragment>
                <h2 className="mb-2 text-subtitle font-weight-bold text-white text-shadow text-center">
                    Extrato
                </h2>
                <AsyncOrdersTableContent
                    needGenerateList
                    orders={orders}
                    loading={!orders}
                    plan={thisPlan}
                    period={thisPeriod}
                    notesColor="white"
                />
                {isRenewable && (
                    <section className="my-5 container-center">
                        <ButtonFab
                            size="medium"
                            title={
                                loadingOrderPage
                                    ? "Carregando..."
                                    : "Renovar Plano"
                            }
                            onClick={() => {
                                setLoadingOrderPage(true);
                                setProRenewal({
                                    ref: reference,
                                    itemList: orders,
                                    investAmount,
                                    planBr: thisPlan,
                                    period: thisPeriod,
                                }).then(() => {
                                    setLoadingOrderPage(false);
                                    history.push("/pedidos/admin");
                                });
                            }}
                            backgroundColor="var(--themeSDark--default)"
                            variant="extended"
                        />
                    </section>
                )}
            </Fragment>
        );
    };

    return (
        <section className="position-relative text-normal enabledLink panel-hidden-content--root">
            {showPayDetails()}
            {showInvestExtract()}
        </section>
    );
}

// HELPERS
function getPlanCodeBr(code) {
    if (code === "OU") return "ouro";
    if (code === "PR") return "prata";
    if (code === "BR") return "bronze";

    return "";
}
// END HELPERS

export default withRouter(PanelHiddenContent);

/* ARCHIVES
<TextField
    multiline
    rows={8}
    id="msgArea"
    name="message"
    InputProps={{
        style: styles.fieldFormValue,
    }}
    value={data.sentMsgDesc}
    variant="outlined"
    fullWidth
/>

<p className="animated flip slow delay-2s"> first flip that I was looking for with the style of  a n entire 360 with zooming.
<CreatedAtBr createdAt={createdAt} />
*/
