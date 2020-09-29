import React, { useState, useEffect, Fragment } from "react";
import Card from "@material-ui/core/Card";
import ButtonFab from "../../../../../../components/buttons/material-ui/ButtonFab";
import copyTextToClipboard from "../../../../../../utils/document/copyTextToClipboard";
import { useStoreDispatch } from "easy-peasy";
import { showSnackbar } from "../../../../../../redux/actions/snackbarActions";
import TextField from "@material-ui/core/TextField";
import convertToReal from "../../../../../../utils/numbers/convertToReal";
import getFirstName from "../../../../../../utils/string/getFirstName";
import getSlashDayMonthYear from "../../../../../../utils/dates/getSlashDayMonthYear";
import { ShowPayWatermarks } from "../../comps/GlobalComps";
// import animateCSS from '../../../../utils/animateCSS';
// import scrollIntoView from '../../../../utils/document/scrollIntoView';

const isSmall = window.Helper.isSmallScreen();
const getStyles = () => ({
    card: {
        margin: "auto",
        width: "95%",
        maxWidth: isSmall ? "" : 450,
    },
    fieldFormValue: {
        backgroundColor: "#fff",
        color: "var(--themeP)",
        fontSize: "20px",
        fontWeight: "bold",
        fontFamily: "var(--mainFont)",
    },
});

const getBarcodeSplit = (code) => {
    if (!code) return;

    const firstChunk = code.slice(0, 22);
    const secondChunk = code.slice(22);

    return (
        <span className="d-inline-block text-left text-normal font-weight-bold text-purple">
            {firstChunk}
            <br />
            {secondChunk}
        </span>
    );
};

export default function AsyncBoleto({ modalData }) {
    const [copy, setCopy] = useState(false);
    const [data, setData] = useState({
        paymentLink: "",
        barcode: "",
        dueDate: "",
    });
    const { paymentLink, barcode, dueDate } = data;

    const {
        responseData,
        processing,
        handleSelected,
        setPayMethods,
        authToken,
        getSenderHash,
        itemDescription,
        itemAmount,
        adminName,
        PagSeguro,
    } = modalData;

    const styles = getStyles();
    const dispatch = useStoreDispatch();

    useEffect(() => {
        if (responseData)
            setData({
                ...responseData,
                dueDate: getSlashDayMonthYear(responseData.dueDate),
            });
    }, [responseData]);

    useEffect(() => {
        PagSeguro.setSessionId(authToken);
        PagSeguro.getPaymentMethods({
            amount: undefined, // returns all methods if not defined.
            success: function (response) {
                // n2
                setPayMethods(response.paymentMethods);
            },
            error: function (response) {
                console.log("Callback para chamadas que falharam", response);
            },
            complete: function (response) {
                // console.log("Callback para todas chamadas", response);
            },
        });

        handleSelected("No Boleto");
        setTimeout(() => getSenderHash(), 2500);
    }, []);

    const showTitle = () => (
        <div className="mt-2">
            <p className="text-em-1-9 main-font text-purple text-center font-weight-bold">
                Fiddelize Invista
            </p>
        </div>
    );

    const showLogoAndDueDate = () => (
        <section className="mx-3 my-3 d-flex justify-content-between">
            <section>
                <div>
                    <img
                        className="img-fluid"
                        width={120}
                        height={75}
                        src="/img/icons/pay/boleto.png"
                        alt="código de barras"
                    />
                </div>
            </section>
            <section className="text-p-light font-weight-bold text-normal text-right">
                Vence em
                <br />
                <div className="text-left" style={{ lineHeight: "30px" }}>
                    <span className="text-em-1-5">3 </span>
                    <span className="text-em-1-3">dias</span>
                    <br />
                    <span>({dueDate})</span>
                </div>
            </section>
        </section>
    );

    const showDescription = () => (
        <section className="mx-3 mt-3 mb-5">
            <p className="m-0 text-purple font-weight-bold text-subtitle text-left">
                Referente a:
            </p>
            <div className="text-purple font-weight-bold text-normal text-left">
                {itemDescription}
                <span className="text-pill">
                    {convertToReal(itemAmount, { moneySign: true })}
                </span>
            </div>
        </section>
    );

    const showBarcode = () => (
        <div className="mx-3 mb-5 container-center">
            {!copy ? (
                <p className="m-0 text-center">{getBarcodeSplit(barcode)}</p>
            ) : (
                <TextField
                    multiline
                    rows={2}
                    id="barcodeLineArea"
                    name="message"
                    InputProps={{
                        style: styles.fieldFormValue,
                    }}
                    value={barcode}
                    variant="outlined"
                    fullWidth
                />
            )}
            <img
                className="img-fluid"
                height={80}
                src="/img/icons/pay/fiddelize-invista-barcode.svg"
                alt="código de barras"
            />
        </div>
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

    const showCTA = () => (
        <section className="my-4 d-flex justify-content-around">
            <a
                rel="noopener noreferrer"
                className="no-text-decoration"
                href={paymentLink}
                target="_blank"
            >
                <ButtonFab
                    size="medium"
                    title="Ver Doc."
                    onClick={null}
                    backgroundColor={"var(--themeSDark--default)"}
                    variant="extended"
                    position="relative"
                />
            </a>
            <ButtonFab
                size="medium"
                title="Copiar Linha"
                onClick={handleCopy}
                backgroundColor={"var(--themeSDark--default)"}
                variant="extended"
                position="relative"
            />
        </section>
    );

    const showMsgProcessing = () => (
        <section
            id="PayContent--boleto-msg"
            className="container-center-col mx-3 my-5 text-subtitle font-weight-bold text-purple text-left"
        >
            <span className="text-em-1-5">Boleto Automático</span>
            <br />É para já, {getFirstName(adminName)}!
            <br />
            Seu Boleto está sendo feito agora! Um momento, carregando...
        </section>
    );

    const showBoleto = () => (
        <section className="container-center" style={{ marginBottom: "50px" }}>
            <h1 className="animated fadeInDown delay-3s text-nowrap text-purple font-weight-bold text-subtitle text-left">
                Prontinho!
            </h1>
            <Card
                className="position-relative mt-0 mb-5 animated fadeInUp normal shadow-elevation"
                style={styles.card}
                elevation={false}
            >
                {showLogoAndDueDate()}
                {showDescription()}
                {showBarcode()}
                {showCTA()}
            </Card>
        </section>
    );

    return (
        <Fragment>
            {showTitle()}
            {processing ? showMsgProcessing() : showBoleto()}
            <ShowPayWatermarks needAnima={false} />
        </Fragment>
    );
}
