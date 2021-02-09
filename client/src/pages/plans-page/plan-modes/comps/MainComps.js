import React, { Fragment, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab from "../../../../components/buttons/material-ui/ButtonFab";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import SwitchBtn from "../../../../components/buttons/material-ui/SwitchBtn";
import convertToReal from "../../../../utils/numbers/convertToReal";
import animateCSS from "../../../../utils/animateCSS";
import NotificationBadge from "../../../../components/NotificationBadge";
import "./_MainComps.scss";

const isSmall = window.Helper.isSmallScreen();

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
        clipPath: `ellipse(${isSmall ? "49% 13%" : "40% 17%"} at 13% 96%)`, // alternative : clip-path: circle(50.5% at 10% 0%); padding: 330px
        webPackClipPath: `ellipse(${
            isSmall ? "49% 13%" : "40% 17%"
        } at 13% 96%)`,
    },
    muStyle: {
        transform: "scale(1.7)",
        color: "var(--mainWhite)",
    },
    rootPeriod: {
        position: "relative",
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
                onClick={onClick}
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

const TotalInvest = ({ totalInvest, totalServices }) => {
    const styles = getStyles();

    const totalCartRef = useRef();

    useEffect(() => {
        totalCartRef.current &&
            animateCSS(
                totalCartRef.current,
                "rubberBand",
                "normal",
                () => null
            );
    }, [totalInvest, totalCartRef]);

    const totalCart = convertToReal(totalInvest, { moneySign: true });

    const showCart = () => (
        <NotificationBadge
            badgeValue={totalServices}
            badgeInvisible={false}
            backgroundColor="var(--mainRed)"
            borderColor="var(--mainWhite)"
            top={-6}
            right={25}
            fontSize="15px"
            padding="10px"
        >
            <ShoppingCartIcon className="mx-3 mt-2" style={styles.muStyle} />
        </NotificationBadge>
    );

    return (
        <Fragment>
            <div style={styles.clipPathBottom}></div>
            <section className="position-fixed d-flex" style={{ bottom: 0 }}>
                {showCart()}
                <div className="text-subtitle text-white font-weight-bold">
                    <span
                        style={{ lineHeight: "13px" }}
                        className="d-block font-weight-bold text-normal text-white"
                    >
                        Total:
                    </span>
                    <p ref={totalCartRef} className="m-0">
                        {totalCart}
                    </p>
                </div>
            </section>
        </Fragment>
    );
};

const PeriodSelection = ({ handlePeriod, containerCenter = false }) => {
    const styles = getStyles();

    const handlePeriodChange = (status) => {
        const isMonthly = status && status.includes("false");
        handlePeriod(isMonthly ? "monthly" : "yearly");
    };

    return (
        <section
            className={containerCenter ? "container-center" : undefined}
            style={!containerCenter ? styles.rootPeriod : undefined}
        >
            <SwitchBtn
                titleQuestion=""
                titleLeft="Mensal"
                titleRight="Anual"
                callback={handlePeriodChange}
                defaultStatus={true}
                pillStyle={true}
                pillBack="var(--mainWhite)"
            />
        </section>
    );
};

const MinimizedUpperOptions = ({
    isScrollingUpward,
    hidePlan = "bronze", // hidePlan is always the current plan which corresponding the current page button itself
    currPlanBr,
    period,
    setCurrPlan,
}) => (
    <Fragment>
        <div className="minimized-upper period animated fadeInDown text-small text-white font-weight-bold">
            Plano {currPlanBr} {period === "yearly" ? "Anual" : "Mensal"}
        </div>
        {isScrollingUpward && (
            <section className="minimized-upper container-btns animated fadeInDown delay-1s">
                <div>
                    <div
                        className={`${
                            hidePlan === "gold" ? "d-none" : "d-block"
                        } button gold-btn text-small text-white font-weight-bold`}
                        onClick={() => setCurrPlan("gold")}
                    >
                        ouro
                    </div>
                    <div
                        className={`${
                            hidePlan === "silver" ? "d-none" : "d-block"
                        } button silver-btn text-small text-white font-weight-bold`}
                        onClick={() => setCurrPlan("silver")}
                    >
                        prata
                    </div>
                    <div
                        className={`${
                            hidePlan === "bronze" ? "d-none" : "d-block"
                        } button bronze-btn text-white font-weight-bold`}
                        onClick={() => setCurrPlan("bronze")}
                    >
                        bronze
                    </div>
                </div>
            </section>
        )}
    </Fragment>
);

export { ContinueBtn, TotalInvest, PeriodSelection, MinimizedUpperOptions };
