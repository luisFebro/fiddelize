import React, { Fragment, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import clsx from "clsx";
import EventIcon from "@material-ui/icons/Event";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setVar } from "../../../../../../../hooks/storage/useVar";
import { withRouter } from "react-router-dom";
import "./Accordion.scss";
import ToggleBtn from "./ToggleBtn";
import ButtonFab from "../../../../../../../components/buttons/material-ui/ButtonFab";
import RadiusBtn from "../../../../../../../components/buttons/RadiusBtn";
import getDatesCountdown from "../../../../../../../hooks/dates/getDatesCountdown";
import { isScheduledDate } from "../../../../../../../utils/dates/dateFns";

const isSmall = window.Helper.isSmallScreen();

InvestCard.propTypes = {
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            mainHeading: PropTypes.object, // parser
            secondaryHeading: PropTypes.object, // parser
            hiddenContent: PropTypes.any,
        })
    ).isRequired,
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    needToggleButton: PropTypes.bool,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: isSmall ? "100%" : "80%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        padding: "15px 0",
        margin: isSmall ? "10px 0 40px" : "10px 80px 40px",
    },
}));

const getStyles = ({ color, backgroundColor }) => ({
    accordion: {
        color: color,
        backgroundColor: backgroundColor,
        margin: "25px 0 0",
    },
    totalPrizesBadge: {
        top: 0,
        right: -33,
        borderRadius: "50px",
        backgroundColor: "var(--niceUiYellow)",
        border: "3px solid grey",
        zIndex: 10,
    },
    expiryCounter: {
        right: 55,
        top: 70,
    },
});

function InvestCard({
    history,
    detectedCard,
    checkDetectedElem,
    actions,
    needToggleButton = false,
}) {
    const classes = useStyles();
    const styles = getStyles({
        color: "var(--mainWhite)",
        backgroundColor: "var(--themePLight)",
    });

    // const dispatch = useStoreDispatch();

    const displayExpiryCounter = (panel, daysLeft) => {
        const {
            transactionStatus,
            reference,
            payDueDate,
            renewal,
        } = panel.data;
        console.log("renewal", renewal);
        const isRenewable =
            (renewal && renewal.priorRef) !== reference &&
            transactionStatus !== "pendente";
        const isDuePay =
            !isScheduledDate(payDueDate, { isDashed: true }) &&
            transactionStatus !== "pago"; // for boleto
        const isPaid =
            transactionStatus === "pago" || transactionStatus === "disponível";

        const handleRenewalClick = () => {
            async function setAllVars(panel) {
                const readyVar = await Promise.all([
                    setVar({ orders_clientAdmin: panel.data.ordersStatement }),
                    setVar({
                        totalMoney_clientAdmin: panel.data.investAmount,
                    }),
                    setVar({
                        planPeriod_clientAdmin:
                            panel.data.chosenPeriod === "Anual"
                                ? "yearly"
                                : "monthly",
                    }),
                    setVar({
                        ordersPlan_clientAdmin: panel.data.chosenPlan,
                    }),
                    setVar({
                        renewalDaysLeft_clientAdmin: 0,
                    }),
                    setVar({
                        renewalRef_clientAdmin: reference,
                    }),
                ]);

                history.push("/pedidos/admin");
            }

            setAllVars(panel);
        };

        return (
            <Fragment>
                {isPaid && daysLeft ? (
                    <section
                        className="enabledLink position-absolute"
                        style={styles.expiryCounter}
                    >
                        <EventIcon
                            className="shadow-elevation-black"
                            style={{ transform: "scale(1.2)", color: "#fff" }}
                        />
                        <FontAwesomeIcon
                            icon="bolt"
                            style={{
                                color: "var(--incomeGreen)",
                                fontSize: "20px",
                            }}
                        />
                        <span className="text-small text-shadow font-weight-bold d-inline-block ml-1">
                            expira em:
                        </span>
                        <p
                            className="position-relative text-normal text-white text-shadow font-weight-bold"
                            style={{
                                left: 30,
                                top: -5,
                            }}
                        >
                            {daysLeft || 0} dias
                        </p>
                    </section>
                ) : (
                    <Fragment>
                        <section
                            className="position-absolute text-normal text-shadow font-weight-bold"
                            style={{
                                right: 50,
                                top: 70,
                                color: "var(--lightGrey)",
                            }}
                        >
                            <FontAwesomeIcon
                                icon="bolt"
                                style={{
                                    color: "var(--lightGrey)",
                                    fontSize: "20px",
                                }}
                            />{" "}
                            desativado
                        </section>
                        {isDuePay && isRenewable && (
                            <section
                                className="d-flex position-absolute"
                                style={{
                                    right: 75,
                                    top: 95,
                                }}
                            >
                                <p
                                    className="mr-1 text-small text-shadow font-weight-bold"
                                    style={{
                                        color: "var(--lightGrey)",
                                    }}
                                >
                                    boleto expirou
                                </p>
                                <RadiusBtn
                                    className="enabledLink"
                                    position="absolute"
                                    right={-50}
                                    title="novo"
                                    variant="extended"
                                    onClick={() => handleRenewalClick()}
                                    size="extra-small"
                                    color="var(--mainWhite)"
                                    backgroundColor="var(--themeSDark)"
                                />
                            </section>
                        )}
                        {daysLeft >= 0 && isPaid && (
                            <RadiusBtn
                                className="enabledLink"
                                position="absolute"
                                top={100}
                                right={50}
                                title="Renovar"
                                variant="extended"
                                onClick={() => handleRenewalClick()}
                                size="extra-small"
                                color="var(--mainWhite)"
                                backgroundColor="var(--themeSDark)"
                            />
                        )}
                    </Fragment>
                )}
            </Fragment>
        );
    };

    const displayStatusBadge = (panel, daysLeft) => {
        let { transactionStatus, payDueDate, renewal, reference } = panel.data;
        const isDuePay =
            !isScheduledDate(payDueDate, { isDashed: true }) &&
            transactionStatus !== "pago"; // for boleto

        transactionStatus =
            transactionStatus && transactionStatus.toUpperCase();
        if (!transactionStatus) transactionStatus = "PENDENTE";
        if (transactionStatus === "DISPONÍVEL") transactionStatus = "PAGO";
        if (isDuePay || (daysLeft === 0 && transactionStatus !== "PENDENTE"))
            transactionStatus = "EXPIRADO";
        if (renewal) {
            const isPriorCardRenewal = renewal.priorRef === reference;
            const isCurrCardRenewal = renewal.currRef === reference;
            if (isPriorCardRenewal && renewal.isPaid) {
                transactionStatus = "RENOVADO";
            } else {
                transactionStatus = "PENDENTE/RENOVAÇÃO";
            }

            if (renewal.isPaid && isCurrCardRenewal) {
                transactionStatus = "PAGO/RENOVADO";
            }
        }

        const handleBack = () => {
            if (transactionStatus === "PENDENTE") return "grey";
            if (
                transactionStatus === "PAGO" ||
                transactionStatus === "PAGO/RENOVADO"
            )
                return "var(--incomeGreen)";
            if (transactionStatus === "RENOVADO") return "var(--niceUiYellow)";
            if (
                transactionStatus === "CANCELADO" ||
                transactionStatus === "EXPIRADO"
            )
                return "var(--expenseRed)";
            return "var(--mainDark)";
        };

        return (
            <div className="enabledLink">
                <ButtonFab
                    position="absolute"
                    top={-20}
                    right={0}
                    disabled={true}
                    title={transactionStatus}
                    variant="extended"
                    fontWeight="bolder"
                    fontSize=".6em"
                    color="var(--mainWhite)"
                    backgroundColor={handleBack()}
                />
            </div>
        );
    };

    const showPanel = (panel, daysLeft) => {
        return (
            <section>
                <AccordionSummary
                    expandIcon={
                        <div className="enabledLink">
                            {needToggleButton && (
                                <ToggleBtn cardId={panel._id} />
                            )}
                        </div>
                    }
                    aria-controls={`panel${panel._id}bh-content`}
                    id={`panel${panel._id}bh-header`}
                >
                    {isSmall ? (
                        <section className="position-relative">
                            <div>{panel.mainHeading}</div>
                            {panel.secondaryHeading}
                        </section>
                    ) : (
                        <Fragment>
                            <Typography className="ex-pa-main-heading ex-pa--headings">
                                {panel.mainHeading}
                            </Typography>
                            <Typography className="ex-pa--headings">
                                {panel.secondaryHeading}
                            </Typography>
                        </Fragment>
                    )}
                </AccordionSummary>
                {displayStatusBadge(panel, daysLeft)}
                {displayExpiryCounter(panel, daysLeft)}
            </section>
        );
    };

    const showHiddenPanel = (panel) => (
        <AccordionDetails>{panel.hiddenContent}</AccordionDetails>
    );

    const showAccordion = ({ panel, daysLeft }) => (
        <Accordion
            TransitionProps={{ unmountOnExit: true }}
            className="disabledLink"
            style={styles.accordion}
        >
            {showPanel(panel, daysLeft)}
            {showHiddenPanel(panel)}
        </Accordion>
    );

    const ActionsMap = actions.map((panel, ind) => {
        const { planDueDate, periodDays } = panel.data;
        const daysLeft = !planDueDate
            ? null
            : getDatesCountdown(planDueDate, {
                  deadline: periodDays,
              });

        const props = {
            key: ind,
            className: "position-relative mx-3 mb-5",
        };

        return checkDetectedElem({ list: actions, ind, indFromLast: 5 }) ? (
            <div {...props} ref={detectedCard}>
                {showAccordion({ panel, daysLeft })}
            </div>
        ) : (
            <div {...props}>{showAccordion({ panel, daysLeft })}</div>
        );
    });

    return <div className={classes.root}>{ActionsMap}</div>;
}

export default withRouter(InvestCard);
