import { Fragment, useState } from "react";
import { withRouter } from "react-router-dom";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import LoadableVisible from "components/code-splitting/LoadableVisible";
import setProRenewal from "utils/biz/setProRenewal";
import showToast from "components/toasts";
import { isScheduledDate } from "utils/dates/dateFns";
import extractStrData from "utils/string/extractStrData";
import copyText from "utils/document/copyText";

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

function PanelHiddenContent({ history, data }) {
    const [loadingOrderPage, setLoadingOrderPage] = useState(false);

    const showBoletoDetails = () => {
        const isDuePay =
            !isScheduledDate(data.payDueDate, { isDashed: true }) &&
            data.transactionStatus !== "pago"; // for boleto

        const handleCopy = () => {
            copyText(data.barcode, {
                msg: "Linha Copiada! Use no App do seu banco favorito.",
            });
        };

        return (
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
                                        onClick={() => handleCopy()}
                                        backgroundColor="var(--themeSDark--default)"
                                        variant="extended"
                                    />
                                </div>
                                {data.barcode}
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
    };

    const showBankDebitDetails = () => (
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

    const showCreditCardDetails = () => {
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

    const showPixDetails = () => (
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
                    {isBoleto && showBoletoDetails()}
                    {isBankDebit && showBankDebitDetails()}
                    {isCreditCard && showCreditCardDetails()}
                    {isPix && showPixDetails()}
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
                    listData={orders}
                    loading={!orders}
                    planBr={thisPlan}
                    period={thisPeriod}
                />
                <section className="my-5 container-center">
                    <ButtonFab
                        size="medium"
                        title={
                            loadingOrderPage
                                ? "Carregando..."
                                : "Renovar Pedido"
                        }
                        onClick={() => {
                            if (!isRenewable)
                                return showToast(
                                    "Pedido precisa está pago para renovar."
                                );
                            setLoadingOrderPage(true);
                            setProRenewal({
                                itemList: orders,
                                investAmount,
                                planBr: thisPlan,
                                period: thisPeriod,
                            }).then(() => {
                                setLoadingOrderPage(false);
                                history.push("/pedidos/admin");
                            });
                        }}
                        backgroundColor={
                            isRenewable
                                ? "var(--themeSDark--default)"
                                : "var(--themeSDark--white)"
                        }
                        variant="extended"
                    />
                </section>
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
