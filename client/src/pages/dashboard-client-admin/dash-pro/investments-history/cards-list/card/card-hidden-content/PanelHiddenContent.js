import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { useStoreState } from "easy-peasy";
import TextField from "@material-ui/core/TextField";
import ButtonFab from "../../../../../../../components/buttons/material-ui/ButtonFab";
import { Load } from "../../../../../../../components/code-splitting/LoadableComp";
import copyTextToClipboard from "../../../../../../../utils/document/copyTextToClipboard";
import { useStoreDispatch } from "easy-peasy";
import { showSnackbar } from "../../../../../../../redux/actions/snackbarActions";

const AsyncExtract = Load({
    loader: () =>
        import(
            "./AsyncExtract" /* webpackChunkName: "sms-extract-comp-lazy" */
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
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "20px",
        fontFamily: "var(--mainFont)",
    },
});

export default function PanelHiddenContent({ data }) {
    const { runArray } = useStoreState((state) => ({
        runArray: state.globalReducer.cases.runArray,
    }));

    const styles = getStyles();

    const dispatch = useStoreDispatch();

    const handleCopy = () => {
        copyTextToClipboard("#msgArea", () =>
            showSnackbar(dispatch, "Mensagem copiada!", "success")
        );
    };

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

    const showBoletoDetails = (data) => (
        <Fragment>
            <p className="text-subtitle font-weight-bold text-shadow">
                • Referência:
                <span className="d-block text-normal font-weight-bold">
                    {data.reference}
                </span>
            </p>
            {data.transactionStatus !== "pago" && (
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
                                onClick={null}
                                backgroundColor={"var(--themeSDark--default)"}
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
                                backgroundColor={"var(--themeSDark--default)"}
                                variant="extended"
                            />
                        </a>
                    </section>
                </Fragment>
            )}
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

    const showInvestExtract = () => {
        const isOpen = runArray.includes(data._id); // only when the card is open is loaded.

        return (
            isOpen && (
                <Fragment>
                    <AsyncExtract extractId={data._id} />
                    <section className="my-5 container-center">
                        <ButtonFab
                            size="medium"
                            title="Renovar Plano"
                            onClick={null}
                            backgroundColor={"var(--themeSDark--default)"}
                            variant="extended"
                        />
                    </section>
                </Fragment>
            )
        );
    };

    const showNotes = () => (
        <section>
            1. A tempo de uso dos <strong>serviços em pré-venda</strong> só
            começam a contar quando for lançado. Você será notificado. E
            receberá um novo card com devido tempo de uso. 2. Os pacotes de SMS
            não tem validade, não expiram. 3. Você tem acesso aos seus clientes
            e equipe que você já cadastrou e eles continuam usando o app mesmo
            quando o prazo de uso terminar. 4. As quantidades disponíveis em
            cada serviço não são acumulativas.
        </section>
    );

    return (
        <section className="position-relative text-normal enabledLink panel-hidden-content--root">
            {showPayDetails(data)}
            {showInvestExtract()}
        </section>
    );
}

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
