import React, { useState, useEffect, Fragment } from "react";
import Card from "@material-ui/core/Card";
import ButtonFab from "../../../../../../components/buttons/material-ui/ButtonFab";
import copyTextToClipboard from "../../../../../../utils/document/copyTextToClipboard";
import { useStoreDispatch } from "easy-peasy";
import { showSnackbar } from "../../../../../../redux/actions/snackbarActions";
import TextField from "@material-ui/core/TextField";
import convertToReal from "../../../../../../utils/numbers/convertToReal";
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

export default function AsyncCredit({ modalData }) {
    const [copy, setCopy] = useState(false);

    const { itemDescription, itemAmount, userFirstName } = modalData;

    const styles = getStyles();
    const dispatch = useStoreDispatch();

    // useEffect(() => {
    //     handleDataMethod({
    //      paymentMethod: "No Débito",
    //      senderHash: ffds,
    //     });
    // }, [])

    const showTitle = () => (
        <div className="mt-2">
            <p className="text-em-1-9 main-font text-purple text-center font-weight-bold">
                Fiddelize Invista
            </p>
        </div>
    );

    const showCTA = () => (
        <section className="my-4 d-flex justify-content-around">
            <ButtonFab
                size="medium"
                title="Ver Doc."
                onClick={null}
                backgroundColor={"var(--themeSDark--default)"}
                variant="extended"
                position="relative"
            />
        </section>
    );

    const showMaintenanceMsg = () => (
        <section className="container-center-col mx-3 my-5 text-subtitle font-weight-bold text-purple text-left">
            <span className="text-em-1-5">Débito Online</span>
            <br />
            {userFirstName}, ainda estamos trabalhando nesta opção de pagamento.
            Logo ficará disponível!
        </section>
    );

    const showMsgProcessing = () => (
        <section
            id="PayContent--boleto-msg"
            className="container-center-col mx-3 my-5 text-subtitle font-weight-bold text-purple text-left"
        >
            Some loading Msg
        </section>
    );

    const showCreditCard = () => (
        <section className="container-center">I am the CREDITCARD</section>
    );

    return (
        <Fragment>
            {showTitle()}
            {showMaintenanceMsg()}
            <ShowPayWatermarks needAnima={false} />
        </Fragment>
    );
}
