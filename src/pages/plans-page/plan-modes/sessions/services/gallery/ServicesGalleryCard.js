import { useState } from "react";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import RemoveIcon from "@material-ui/icons/Remove";
import truncateWords from "../../../../../../utils/string/truncateWords";
import PremiumButton from "../../../../../../components/buttons/premium/PremiumButton";
import ButtonFab from "../../../../../../components/buttons/material-ui/ButtonFab";
import convertToReal from "../../../../../../utils/numbers/convertToReal";
import "./_ServicesGalleryCard.scss";

const isSmall = window.Helper.isSmallScreen();

const muStyle = {
    transform: "scale(1.5)",
    zIndex: 1,
};

const getStyles = () => ({
    titleContainer: {
        height: isSmall ? "60px" : "80px",
    },
    imgContainer: {
        position: "relative",
        overflow: "hidden",
    },
    addCardBtn: {
        bottom: -10,
        right: -10,
    },
    addedBadge: {
        bottom: -22,
        right: 30,
    },
});

export default function ServicesGalleryCard({ handleNewOrder, data }) {
    const {
        serviceName,
        servicePrice,
        serviceDesc,
        servicePage,
        serviceIcon,
        period,
    } = data;

    const isYearly = period === "yearly";

    const [selected, setSelected] = useState(false);
    const styles = getStyles();

    const servicePriceReal = convertToReal(servicePrice, { moneySign: true });
    const serviceMonthlyPrice =
        isYearly && convertToReal(servicePrice / 12, { moneySign: true });

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
        <p
            style={styles.titleContainer}
            className={`${
                selected ? "text-white" : "text-purple"
            } d-flex justify-content-center align-items-center mb-0 mx-2 pt-3 text-normal text-center font-weight-bold`}
        >
            {serviceName}
        </p>
    );

    const showServiceIcon = () => (
        <section className="p-1 p-sm-3 img-container">
            <img src={serviceIcon} alt="serviço varejo" />
        </section>
    );

    const showDesc = () => (
        <div className="card-footer">
            <p
                className={`${
                    selected ? "text-white" : "text-purple"
                } desc m-0`}
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
                proPage={servicePage}
            />
        </div>
    );

    /*
    <div class="text-purple p-2 font-weight-bold text-normal position-relative">R$&nbsp;50</div>
     */

    const showPrice = () => (
        <div
            className={`${
                selected ? "text-white text-shadow" : "text-purple"
            } p-2 position-relative font-weight-bold text-normal`}
            style={{ lineHeight: "20px" }}
        >
            {isYearly ? serviceMonthlyPrice : servicePriceReal}
            {isYearly && (
                <span className="d-block text-small font-weight-bold">
                    {servicePriceReal}/ano
                </span>
            )}
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
                        disabled
                        color="var(--mainWhite)"
                        backgroundColor="var(--themeP)"
                        variant="extended"
                    />
                </div>
            )}
        </section>
    );

    return (
        <section className="mb-5 col-6 col-md-4 col-lg-3 mx-auto">
            <section
                className="shadow-babadoo grid-card--root"
                style={{
                    ...styles.card,
                    background: selected ? "var(--themePLight)" : "#fff",
                }}
            >
                {showTitle()}
                {showServiceIcon()}
                {showDesc()}
                {showPremiumBtn()}
                {showPrice()}
                {showAddCartBtn()}
            </section>
        </section>
    );
}
