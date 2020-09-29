import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import truncateWords from "../../../../../../utils/string/truncateWords";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import PremiumButton from "../../../../../../components/buttons/premium/PremiumButton";
import ButtonFab, {
    muStyle,
} from "../../../../../../components/buttons/material-ui/ButtonFab";

const getStyles = () => ({
    card: {
        maxWidth: 228,
        overflow: "visible",
    },
    cardTitle: {
        minHeight: "60px",
    },
    imgContainer: {
        position: "relative",
        overflow: "hidden",
    },
    descContainer: {
        height: "7em",
        overflow: "hidden",
    },
    descTxt: {
        font: "normal 1.3rem var(--mainFont)",
        lineHeight: "25px",
    },
    addCardBtn: {
        bottom: -10,
        left: -10,
    },
});

export default function ServicesGalleryCard() {
    const [selected, setSelected] = useState(false);
    const styles = getStyles();

    const toggleSelection = (cardName) => {
        setSelected((prev) => !prev);
        //     if(!selected) {
        //         setSelected(cardName);
        //     } else {
        //         setSelected("");
        //     }
    };

    const showServiceIcon = () => (
        <section className="my-3 container-center" style={styles.imgContainer}>
            <img
                className="img-fluid"
                width={100}
                src="img/pro-features/whatsapp-invitation/fiddelize-whatsapp.svg"
                alt="serviço novidade"
            />
        </section>
    );

    const showDesc = () => (
        <div style={styles.descContainer}>
            <p
                className={`${
                    selected ? "text-white" : "text-purple"
                } text-left mx-2 mt-2`}
                style={styles.descTxt}
            >
                {truncateWords(
                    "Agilize o processo de compra de seus clientes enviando o convite",
                    40
                )}
            </p>
        </div>
    );

    const showPremiumBtn = () => (
        <div className="my-1 d-flex justify-content-center">
            <PremiumButton
                size="compact"
                btnType="pill"
                proFeature="EnvvioWhatsapp_2"
            />
        </div>
    );

    const showPrice = () => (
        <div
            className={`${
                selected ? "text-white" : "text-purple"
            } text-right p-3 font-weight-bold text-normal`}
        >
            R$ 30,0
        </div>
    );

    const showAddCartBtn = () => (
        <div className="position-absolute" style={styles.addCardBtn}>
            <ButtonFab
                size="medium"
                position="relative"
                color="var(--mainWhite)"
                backgroundColor="var(--themeSDark)"
                iconMu={<AddShoppingCartIcon style={muStyle} />}
                onClick={toggleSelection}
            />
        </div>
    );

    return (
        <section className="mb-5 col-6 col-md-4 col-lg-3">
            <Card
                className="shadow-babadoo position-relative"
                style={{
                    ...styles.card,
                    background: selected ? "var(--themePLight)" : "#fff",
                }}
                elevation={false}
            >
                <p
                    style={styles.cardTitle}
                    className={`${
                        selected ? "text-white" : "text-purple"
                    } d-flex justify-content-center align-items-center mx-2 mt-2  text-normal text-center font-weight-bold`}
                >
                    Envvio Whatsapp
                </p>
                {showServiceIcon()}
                {showDesc()}
                {showPremiumBtn()}
                {showPrice()}
                {showAddCartBtn()}
            </Card>
        </section>
    );
}
