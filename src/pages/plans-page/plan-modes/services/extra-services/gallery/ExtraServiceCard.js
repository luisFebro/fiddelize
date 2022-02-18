import { useState } from "react";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import RemoveIcon from "@material-ui/icons/Remove";
import truncateWords from "utils/string/truncateWords";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import convertToReal from "utils/numbers/convertToReal";
import NewCardPill from "components/pills/NewCardPill";
import ActivateBtn from "./activate-btn/ActivateBtn";
// import PremiumButtondsasd from "components/buttons/premium/PremiumButtondsasd";

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

export default function ExtraServiceCard({ handleItem, data }) {
    const {
        serviceName,
        servicePrice,
        serviceDesc,
        servicePage,
        isBeta = true, // in development
        isNew = true,
        serviceIcon,
        period,
    } = data;

    const isYearly = period === "yearly";
    const isFree = servicePrice === 0;

    const [selected, setSelected] = useState(false);
    const styles = getStyles();

    const servicePriceReal = convertToReal(servicePrice, { moneySign: true });
    const serviceMonthlyPrice =
        isYearly && convertToReal(servicePrice / 12, { moneySign: true });

    const toggleSelection = () => {
        setSelected((prev) => !prev);
        const item = {
            name: serviceName,
            count: 1,
            amount: servicePrice,
        };

        handleItem(!selected ? "add" : "remove", {
            item,
        });
    };

    const showTitle = () => (
        <p
            style={styles.titleContainer}
            className={`${
                selected ? "text-white" : "text-purple"
            } position-relative d-flex justify-content-center align-items-center mb-0 mx-2 pt-3 text-normal text-center font-weight-bold`}
        >
            {serviceName}
            {isBeta && (
                <span
                    className="position-absolute text-small text-purple font-weight-bold"
                    style={{
                        bottom: -10,
                        right: 10,
                    }}
                >
                    beta
                </span>
            )}
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
                } desc m-0 text-small font-weight-bold mx-2`}
            >
                {truncateWords(serviceDesc, 76)}
            </p>
        </div>
    );

    const showActivateBtn = () => (
        <div className="py-2 d-flex justify-content-center">
            <ActivateBtn />
        </div>
    );

    /*
    <div class="text-purple p-2 font-weight-bold text-normal position-relative">R$&nbsp;50</div>
     */
    const showFreeBadge = () => (
        <section
            className="position-absolute"
            style={{
                right: 30,
                bottom: 5,
            }}
        >
            <div
                className="d-table"
                style={{
                    backgroundColor: "var(--themeP)",
                    borderRadius: "15px",
                    padding: "3px 5px",
                }}
            >
                <span className="text-em-0-9 text-white text-shadow">
                    grátis
                </span>
            </div>
        </section>
    );

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
            {isFree && showFreeBadge()}
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

    const showNewBadge = () => (
        <section
            className="position-absolute"
            style={{
                top: -10,
                left: -10,
            }}
        >
            <NewCardPill />
        </section>
    );

    return (
        <section className="mb-5 col-6 col-md-4 col-lg-3 mx-auto">
            <section
                className="shadow-babadoo grid-card--root position-relative"
                style={{
                    ...styles.card,
                    background: selected ? "var(--themePLight)" : "#fff",
                }}
            >
                {isNew && showNewBadge()}
                {showTitle()}
                {showServiceIcon()}
                {showDesc()}
                {showPrice()}
                {isFree ? showActivateBtn() : null}
                {!isFree && showAddCartBtn()}
            </section>
            <style jsx>
                {`
                    .grid-card--root position-relative * {
                        // this prevent gallery to be initialized as one column only
                        box-sizing: border-box !important;
                        &:before,
                        &:after {
                            box-sizing: border-box !important;
                        }
                    }

                    .grid-card--root position-relative {
                        border-color: transparent;
                        position: relative;
                        border: 1px solid rgba(0, 0, 0, 0.125);
                        background-color: #fff;
                        border-radius: 0.25rem;
                        // display: flex;
                        // flex-direction: column;
                        // min-width: 0;
                        // word-wrap: break-word;
                        // background-clip: border-box;

                        & .img-container {
                            position: relative;
                            overflow: hidden;
                        }

                        // https://stackoverflow.com/questions/37287153/how-to-get-images-in-bootstraps-card-to-be-the-same-height-width
                        & .img-container > img {
                            flex-shrink: 0;
                            width: 100%;
                            height: 35vw;
                            object-fit: contain; // container - full image with limit height
                        }

                        @media screen and (min-width: 768px) {
                            & .img-container > img {
                                height: 20vw;
                                // object-fit: cover; // cover - image is slightly cut to fit
                            }
                        }

                        & .card-footer {
                            padding: 0.25rem !important;
                            color: var(--themeP);
                        }

                        & .card-footer > .desc {
                            height: 4em; // default 4em; for shorter desc like names just 2em
                            overflow: hidden;
                            font: bold 1.1rem var(--mainFont), sans-serif;
                            line-height: 25px;
                        }

                        @media screen and (min-width: 768px) {
                            & .card-footer > .desc {
                                font: bold 1.3rem var(--mainFont), sans-serif;
                            }
                        }

                        & .card-footer > div {
                            margin: 1rem 0;
                        }
                    }
                `}
            </style>
        </section>
    );
}

/*
<PremiumButton
    size="compact"
    btnType="pill"
    proPage={servicePage}
/>
 */
