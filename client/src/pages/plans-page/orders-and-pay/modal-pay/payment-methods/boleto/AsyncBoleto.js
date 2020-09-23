import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import ButtonFab from "../../../../../../components/buttons/material-ui/ButtonFab";
import copyTextToClipboard from "../../../../../../utils/document/copyTextToClipboard";
import { useStoreDispatch } from "easy-peasy";
import { showSnackbar } from "../../../../../../redux/actions/snackbarActions";
import TextField from "@material-ui/core/TextField";

const isSmall = window.Helper.isSmallScreen();
const getStyles = () => ({
    card: {
        margin: "auto",
        width: "95%",
        maxWidth: isSmall ? "" : 450,
    },
    fieldFormValue: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "20px",
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

export default function AsyncBoleto({
    barcode = "03399853012970000076264045701014383890000015100", // 47 characters
    paymentLink = "https://pagseguro.uol.com.br/checkout/payment/booklet/print.jhtml?c=879c2cdba048c4d86c035b595b0fa02ae3356f147e87a05379bc7d76ab79d5c6a68df7782e6e16ff",
}) {
    const [copy, setCopy] = useState(false);

    const styles = getStyles();
    const dispatch = useStoreDispatch();

    const showLogo = () => (
        <section className="mx-3 my-3">
            <div className="d-flex justify-content-start">
                <img
                    className="img-fluid"
                    width={120}
                    height={75}
                    src="/img/icons/pay/boleto.png"
                    alt="código de barras"
                />
            </div>
            <h1 className="text-purple font-weight-bold text-subtitle text-left">
                Está pronto!
            </h1>
        </section>
    );

    const showBarcode = () => (
        <div className="my-5 container-center">
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
        setTimeout(
            () =>
                copyTextToClipboard("#barcodeLineArea", () =>
                    showSnackbar(
                        dispatch,
                        "Linha Copiada!<br />Use o App do seu banco favorito.",
                        "success"
                    )
                ),
            2000
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

    return (
        <section className="my-5 container-center">
            <Card
                className="position-relative animated fadeInUp mt-0 mb-5 shadow-elevation"
                style={styles.card}
                elevation={false}
            >
                {showLogo()}
                {showBarcode()}
                {showCTA()}
            </Card>
        </section>
    );
}
