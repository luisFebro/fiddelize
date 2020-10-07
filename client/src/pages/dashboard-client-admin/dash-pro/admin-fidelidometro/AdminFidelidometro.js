import React from "react";
import ButtonFab from "../../../../components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const getStyles = () => ({
    root: {
        height: 270,
        background: "var(--themeP)",
        borderRadius: 40,
    },
    score: {
        background: "#fff",
        borderRadius: 30,
    },
    icon: {
        fontSize: "30px",
        filter: "drop-shadow(.5px .5px 1px grey)",
        color: "var(--mainWhite)",
    },
});

export default function AdminFidelidometro() {
    const styles = getStyles();

    const totalInvest = 500;

    const showScore = () => (
        <section className="container-center">
            <div
                className="text-em-2-3 main-font my-4 px-3 text-purple text-center font-weight-bold"
                style={{
                    background: "rgb(255, 255, 255)",
                    borderRadius: 30,
                    display: "table",
                }}
            >
                {totalInvest} pontos
            </div>
        </section>
    );

    const showPrizeGalleryBtn = () => (
        <section className="my-3 container-center">
            <ButtonFab
                size="large"
                title="Galeria Prêmios"
                onClick={null}
                backgroundColor={"var(--themeSDark--default)"}
                variant="extended"
                position="relative"
                iconFontAwesome={
                    <FontAwesomeIcon icon="trophy" style={styles.icon} />
                }
            />
        </section>
    );

    return (
        <section className="my-5" style={styles.root}>
            <div className="text-subtitle py-3 text-white text-center font-weight-bold">
                Seu Fidelidômetro:
            </div>
            {showScore()}
            {showPrizeGalleryBtn()}
        </section>
    );
}
