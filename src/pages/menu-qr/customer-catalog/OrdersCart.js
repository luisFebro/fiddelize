import { Fragment, useRef, useEffect } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import animateCSS from "utils/animateCSS";
import convertToReal from "utils/numbers/convertToReal";
import NotificationBadge from "components/badges/NotificationBadge";
import AssignmentIcon from "@material-ui/icons/Assignment";
// import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

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

export const ReturnBtn = ({ setNextPage }) => (
    <section className="orders-return-btn--root">
        <ButtonFab
            position="relative"
            size="small"
            onClick={() => setNextPage("menu")}
            color="var(--mainWhite)"
            backgroundColor="var(--themeSDark)"
            iconFontAwesome={
                <FontAwesomeIcon icon="arrow-left" style={{ fontSize: 30 }} />
            }
        />
        <style jsx>
            {`
                .orders-return-btn--root {
                    z-index: 3000;
                    position: fixed;
                    top: 15px;
                    left: 15px;
                }
            `}
        </style>
    </section>
);

export const ContinueBtn = ({ onClick }) => {
    const styles = getStyles();

    return (
        <section style={styles.continueBtn}>
            <ButtonFab
                title="ver pedido"
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

export const TotalInvest = ({ orderAmount, orderCount }) => {
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
    }, [orderAmount, totalCartRef]);

    const totalCart = convertToReal(orderAmount, { moneySign: true });

    const showCart = () => (
        <NotificationBadge
            badgeValue={orderCount}
            badgeInvisible={false}
            backgroundColor="var(--mainRed)"
            borderColor="var(--mainWhite)"
            animationName="none"
            top={5}
            right={20}
            fontSize="15px"
            padding="10px"
        >
            <AssignmentIcon className="mx-3 mt-2" style={styles.muStyle} />
        </NotificationBadge>
    );

    return (
        <Fragment>
            <div style={styles.clipPathBottom} />
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
