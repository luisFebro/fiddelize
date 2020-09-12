import React, { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab from "../../../../components/buttons/material-ui/ButtonFab";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import SwitchBtn from "../../../../components/buttons/material-ui/SwitchBtn";
import convertToReal from "../../../../utils/numbers/convertToReal";

const getStyles = () => ({
    continueBtn: {
        position: "fixed",
        bottom: 15,
        right: 15,
        zIndex: 100,
    },
    clipPathBottom: {
        bottom: 0,
        padding: 180,
        position: "fixed",
        background: "var(--themeP)",
        clipPath: "ellipse(49% 13% at 13% 96%)",
        webPackClipPath: "ellipse(49% 13% at 13% 96%)",
    },
    muStyle: {
        transform: "scale(1.7)",
        color: "var(--mainWhite)",
    },
    rootPeriod: {
        position: "relative",
        height: 300,
        width: 260,
        left: 15,
        top: 20,
    },
});

const ContinueBtn = ({ onClick }) => {
    const styles = getStyles();

    return (
        <section style={styles.continueBtn}>
            <ButtonFab
                title="continuar"
                position="relative"
                onClick={null}
                color="var(--mainWhite)"
                backgroundColor="var(--themeSDark)"
                iconFontAwesome={
                    <FontAwesomeIcon
                        icon="arrow-right"
                        style={{ fontSize: 30 }}
                    />
                }
                variant="extended"
            />
        </section>
    );
};

const TotalInvest = ({ totalInvest }) => {
    const styles = getStyles();

    const totalCart = convertToReal(totalInvest, { moneySign: true });

    return (
        <Fragment>
            <div style={styles.clipPathBottom}></div>
            <section className="position-fixed d-flex" style={{ bottom: 0 }}>
                <ShoppingCartIcon
                    className="mx-3 mt-2"
                    style={styles.muStyle}
                />
                <div className="text-subtitle text-white font-weight-bold">
                    <span
                        style={{ lineHeight: "13px" }}
                        className="d-block font-weight-bold text-normal text-white"
                    >
                        Total:
                    </span>
                    {totalCart}
                </div>
            </section>
        </Fragment>
    );
};

const PeriodSelection = () => {
    const styles = getStyles();

    return (
        <section style={styles.rootPeriod}>
            <SwitchBtn
                titleQuestion=""
                titleLeft="Mensal"
                titleRight="Anual"
                callback={null}
                defaultStatus={true}
                pillStyle={true}
                pillBack="var(--mainWhite)"
            />
        </section>
    );
};

export { ContinueBtn, TotalInvest, PeriodSelection };
