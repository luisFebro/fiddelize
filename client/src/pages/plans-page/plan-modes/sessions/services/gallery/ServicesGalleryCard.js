import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import truncateWords from "../../../../../../utils/string/truncateWords";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import RemoveIcon from "@material-ui/icons/Remove";
import PremiumButton from "../../../../../../components/buttons/premium/PremiumButton";
import ButtonFab from "../../../../../../components/buttons/material-ui/ButtonFab";
import convertToReal from "../../../../../../utils/numbers/convertToReal";

const isSmall = window.Helper.isSmallScreen();

const muStyle = {
    transform: "scale(1.5)",
    zIndex: 1,
};

const getStyles = () => ({
    card: {
        maxWidth: 228,
        overflow: "visible",
    },
    titleContainer: {
        height: isSmall ? "60px" : "80px",
    },
    imgContainer: {
        position: "relative",
        overflow: "hidden",
    },
    descContainer: {
        height: isSmall ? "7em" : "5em",
        overflow: "hidden",
    },
    descTxt: {
        font: "normal 1.3rem Poppins, sans-serif",
        lineHeight: "25px",
    },
    addCardBtn: {
        bottom: -10,
        right: -10,
    },
    addedBadge: {
        bottom: -10,
        right: 40,
    },
});

export default function ServicesGalleryCard({ handleNewOrder, data }) {
    const {
        serviceName,
        servicePrice,
        serviceDesc,
        servicePage,
        serviceIcon,
    } = data;

    const [selected, setSelected] = useState(false);
    const styles = getStyles();

    const servicePriceReal = convertToReal(servicePrice, { moneySign: true });

    const toggleSelection = (cardName) => {
        setSelected((prev) => !prev);
        const orderObj = {
            amount: 1,
            price: servicePrice,
        };
        handleNewOrder(serviceName, {
            order: orderObj,
            removeOrderGroup: !selected ? undefined : serviceName,
        });
    };

    const showTitle = () => (
        <section style={styles.titleContainer}>
            <p
                className={`${
                    selected ? "text-white" : "text-purple"
                } d-flex justify-content-center align-items-center mb-0 mx-2 pt-3 text-normal text-center font-weight-bold`}
            >
                {serviceName}
            </p>
        </section>
    );

    const showServiceIcon = () => (
        <section
            className="p-1 p-sm-3 my-3 mx-auto container-center"
            style={styles.imgContainer}
        >
            <img
                className="img-fluid"
                width={80}
                src={serviceIcon}
                alt="serviço varejo"
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
                {truncateWords(serviceDesc, 40)}
            </p>
        </div>
    );

    const showPremiumBtn = () => (
        <div className="my-1 d-flex justify-content-center">
            <PremiumButton
                size="compact"
                btnType="pill"
                proFeature={servicePage}
            />
        </div>
    );

    const showPrice = () => (
        <div
            className={`${
                selected ? "text-white text-shadow" : "text-purple"
            } text-left p-3 font-weight-bold text-normal`}
        >
            {servicePriceReal}
        </div>
    );

    const showAddCartBtn = () => (
        <section className="position-absolute" style={styles.addCardBtn}>
            <ButtonFab
                size="medium"
                position="relative"
                color="var(--mainWhite)"
                backgroundColor={
                    !selected ? "var(--themeSDark)" : "var(--expenseRed)"
                }
                iconMu={
                    !selected ? (
                        <AddShoppingCartIcon style={muStyle} />
                    ) : (
                        <RemoveIcon style={muStyle} />
                    )
                }
                onClick={toggleSelection}
            />
            {selected && (
                <div className="position-absolute" style={styles.addedBadge}>
                    <ButtonFab
                        title="ADICIONADO!"
                        titleSize="small"
                        position="relative"
                        disabled={true}
                        color="var(--mainWhite)"
                        backgroundColor="var(--themeP)"
                        variant="extended"
                    />
                </div>
            )}
        </section>
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
                {showTitle()}
                {showServiceIcon()}
                {showDesc()}
                {showPremiumBtn()}
                {showPrice()}
                {showAddCartBtn()}
            </Card>
        </section>
    );
}
