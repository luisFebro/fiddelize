import { Fragment, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import SwitchBtn from "components/buttons/material-ui/SwitchBtn";
import convertToReal from "utils/numbers/convertToReal";
import animateCSS from "utils/animateCSS";
import NotificationBadge from "components/badges/NotificationBadge";
import showToast from "components/toasts";
import "./_MainComps.scss";

const isSmall = window.Helper.isSmallScreen();

const getStyles = (isPro = false) => ({
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
        background: `var(--themeP${isPro ? "Dark" : ""})`,
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

const TotalInvest = ({ orderAmount, orderCount, isPro }) => {
    const styles = getStyles(isPro);

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

const PeriodSelection = ({
    setData,
    callback,
    orderList = [],
    plan,
    containerCenter = false,
}) => {
    const styles = getStyles();

    const needDisablePeriodSwitcher = handleDisablePeriod({ orderList, plan });

    const handlePeriodChange = (status) => {
        const isMonthly = status && status.includes("false");
        if (callback) return callback(isMonthly ? "monthly" : "yearly");

        // reset previous period services.
        return (
            setData &&
            setData((prev) => ({
                ...prev,
                orderCount: 0,
                orderAmount: 0,
                orderList: [],
                period: isMonthly ? "monthly" : "yearly",
            }))
        );
    };

    return (
        <section
            className={containerCenter ? "container-center" : undefined}
            style={!containerCenter ? styles.rootPeriod : undefined}
        >
            <p
                className="position-relative mb-2 font-site text-small font-weight-bold text-white"
                style={{
                    left: 15,
                }}
            >
                Qual duração do plano?
            </p>
            <SwitchBtn
                titleQuestion=""
                titleLeft="Mensal"
                titleRight="Anual"
                callback={handlePeriodChange}
                defaultStatus={false}
                pillStyle
                pillBack="var(--mainWhite)"
                disableToLeft={needDisablePeriodSwitcher}
                disableToRight={needDisablePeriodSwitcher}
                disableToLeftCallback={() =>
                    showToast(
                        "Favor, remova todos serviços adicionados para trocar de duração do plano",
                        { type: "warning", dur: 10000 }
                    )
                }
                disableToRightCallback={() =>
                    showToast(
                        "Favor, remova todos serviços adicionados para trocar de duração do plano",
                        { type: "warning", dur: 10000 }
                    )
                }
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
    isPro = false,
}) => {
    if (isPro) {
        if (currPlanBr === "Prata") {
            return (
                <Fragment>
                    <div className="minimized-upper period animated fadeInDown delay-4s text-small text-white font-weight-bold">
                        Plano {currPlanBr}{" "}
                        {period === "yearly" ? "Anual" : "Mensal"}
                    </div>
                    {isScrollingUpward && (
                        <section className="minimized-upper container-btns animated fadeInDown delay-1s">
                            <div>
                                <div
                                    className={`${
                                        hidePlan === "gold"
                                            ? "d-none"
                                            : "d-block"
                                    } button gold-btn text-small text-white font-weight-bold`}
                                    onClick={() => setCurrPlan("gold")}
                                >
                                    ouro
                                </div>
                            </div>
                        </section>
                    )}
                </Fragment>
            );
        }

        return <div />;
    }

    return (
        <Fragment>
            <div className="minimized-upper period animated fadeInDown delay-4s text-small text-white font-weight-bold">
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
};

export { ContinueBtn, TotalInvest, PeriodSelection, MinimizedUpperOptions };

// HELPERS
function handleDisablePeriod({ orderList, plan }) {
    const itemsCount = orderList && orderList.length;

    // by default, Novvos Clientes and Connecta Membros from gold and silver plans are added the default. If any other service is added, it needed to be removed to avoid compute a service from a different period (month or year)
    if (plan === "gold" || plan === "silver") {
        const TOTAL_FULL_PLAN_SERVICES = 2;
        if (itemsCount > TOTAL_FULL_PLAN_SERVICES) return true;

        return false;
    }

    // bronze, by default, ain't got items.
    if (itemsCount) return true;
    return false;
}
// END HELPERS
