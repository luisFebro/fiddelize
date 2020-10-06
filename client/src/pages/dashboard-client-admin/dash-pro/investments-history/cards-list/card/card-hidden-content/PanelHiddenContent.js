import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { useStoreState } from "easy-peasy";
import TextField from "@material-ui/core/TextField";
import ButtonFab from "../../../../../../../components/buttons/material-ui/ButtonFab";
import { Load } from "../../../../../../../components/code-splitting/LoadableComp";
import copyTextToClipboard from "../../../../../../../utils/document/copyTextToClipboard";
import { useStoreDispatch } from "easy-peasy";
import { showSnackbar } from "../../../../../../../redux/actions/snackbarActions";
import { setVar } from "../../../../../../../hooks/storage/useVar";
import { withRouter } from "react-router-dom";
import getDatesCountdown from "../../../../../../../hooks/dates/getDatesCountdown";
import { isScheduledDate } from "../../../../../../../utils/dates/dateFns";

const AsyncOrdersTableContent = Load({
    loader: () =>
        import(
            "../../../../../../../pages/plans-page/orders-and-pay/OrdersTableContent" /* webpackChunkName: "orders-table-content-comp-lazy" */
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

    const { runArray } = useStoreState((state) => ({
        runArray: state.globalReducer.cases.runArray,
    }));

    const isDuePay =
        !isScheduledDate(data.payDueDate, { isDashed: true }) &&
        data.transactionStatus !== "pago"; // for boleto

    const styles = getStyles();

    const dispatch = useStoreDispatch();

    const displayCopyBtn = () => (
        <section className="d-flex justify-content-end my-3">
            <ButtonFab
                size="medium"
                title="Copiar"
                onClick={handleCopy}
                backgroundColor={"var(--themeSDark--default)"}
                variant="extended"
            />
        </section>
    );

    const handleCopy = () => {
        setCopy(true);
        showSnackbar(
            dispatch,
            "Linha Copiada! Use no App do seu banco favorito.",
            "success"
        );
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
            <p className="text-subtitle font-weight-bold text-shadow">
                • Referência:
                <span className="d-block text-normal font-weight-bold">
                    {data.reference}
                </span>
            </p>
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
                                    backgroundColor={
                                        "var(--themeSDark--default)"
                                    }
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
                                    backgroundColor={
                                        "var(--themeSDark--default)"
                                    }
                                    variant="extended"
                                />
                            </a>
                        </section>
                    </Fragment>
                ))}
        </Fragment>
    );

    const showPayDetails = (data) => {
        const payCategory = data.paymentCategory;

        return (
            <section className="mt-4 mb-5">
                <h2 className="mb-2 text-subtitle font-weight-bold text-white text-shadow text-center">
                    Detalhes Transação
                </h2>
                {payCategory === "boleto" && showBoletoDetails(data)}
            </section>
        );
    };

    const showInvestExtract = (data) => {
        const isOpen = runArray.includes(data._id); // only when the card is open is loaded.

        const handlePlanCode = (code) => {
            if (code === "OU") return "ouro";
            if (code === "PR") return "prata";
            if (code === "BR") return "bronze";
        };

        const daysLeft = getDatesCountdown(data.planDueDate, {
            deadline: data.periodDays,
        });

        const {
            ordersStatement: orders,
            investAmount,
            reference,
            renewal,
            transactionStatus,
        } = data;
        const isRenewable =
            (renewal && renewal.priorRef) !== reference &&
            transactionStatus !== "pendente";
        const referenceArray = reference && reference.split("-");
        const [planCode, qtt, period] = referenceArray;

        const thisPlan = handlePlanCode(planCode);
        const thisPeriod = period === "A" ? "yearly" : "monthly";

        return (
            isOpen && (
                <Fragment>
                    <h2 className="mb-2 text-subtitle font-weight-bold text-white text-shadow text-center">
                        Extrato
                    </h2>
                    <AsyncOrdersTableContent
                        needGenerateList={true}
                        orders={orders}
                        loading={!orders ? true : false}
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
                                    async function setAllVars() {
                                        const readyVar = await Promise.all([
                                            setVar({
                                                orders_clientAdmin: orders,
                                            }),
                                            setVar({
                                                totalMoney_clientAdmin: investAmount,
                                            }),
                                            setVar({
                                                planPeriod_clientAdmin: thisPeriod,
                                            }),
                                            setVar({
                                                ordersPlan_clientAdmin: thisPlan,
                                            }),
                                            setVar({
                                                renewalDaysLeft_clientAdmin: daysLeft,
                                            }),
                                            setVar({
                                                renewalRef_clientAdmin: reference,
                                            }),
                                        ]);

                                        setLoadingOrderPage(false);
                                        history.push("/pedidos/admin");
                                    }

                                    setAllVars();
                                }}
                                backgroundColor={"var(--themeSDark--default)"}
                                variant="extended"
                            />
                        </section>
                    )}
                </Fragment>
            )
        );
    };

    return (
        <section className="position-relative text-normal enabledLink panel-hidden-content--root">
            {showPayDetails(data)}
            {showInvestExtract(data)}
        </section>
    );
}

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
