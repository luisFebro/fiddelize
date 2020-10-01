import React, { Fragment, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import clsx from "clsx";
import EventIcon from "@material-ui/icons/Event";
// Customized Data
// import { isScheduledDate } from '../../../../../../../utils/dates/dateFns';
import "./Accordion.scss";
import ToggleBtn from "./ToggleBtn";
import ButtonFab from "../../../../../../../components/buttons/material-ui/ButtonFab";
// End Customized Data

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

export default function InvestCard({
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

    const displayExpiryCounter = (isPaid = true) => {
        return (
            isPaid && (
                <section
                    className="enabledLink position-absolute"
                    style={styles.expiryCounter}
                >
                    <EventIcon
                        className="shadow-elevation-black"
                        style={{ transform: "scale(1.2)", color: "#fff" }}
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
                        30 dias
                    </p>
                </section>
            )
        );
    };

    const displayScheduledBadge = (panel) => {
        let transactionStatus = "pago";
        transactionStatus =
            transactionStatus && transactionStatus.toUpperCase();
        if (transactionStatus === "disponível") transactionStatus = "PAGO";

        const handleBack = () => {
            if (transactionStatus === "PENDENTE") return "grey";
            if (transactionStatus === "PAGO") return "var(--incomeGreen)";
            if (transactionStatus === "CANCELADO") return "var(--expenseRed)";
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

    const showPanel = (panel) => {
        const isPaid = true;

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
                {displayScheduledBadge(panel)}
                {displayExpiryCounter(isPaid)}
            </section>
        );
    };

    const showHiddenPanel = (panel) => (
        <AccordionDetails>{panel.hiddenContent}</AccordionDetails>
    );

    const showAccordion = ({ panel }) => (
        <Accordion
            TransitionProps={{ unmountOnExit: true }}
            className="disabledLink"
            style={{
                ...styles.accordion,
                backgroundColor:
                    panel.data.cardType === "out"
                        ? "var(--themePLight)"
                        : "#00b894",
            }} // data mint green
        >
            {showPanel(panel)}
            {showHiddenPanel(panel)}
        </Accordion>
    );

    const ActionsMap = actions.map((panel, ind) => {
        const props = {
            key: ind,
            className: "position-relative mx-3 mb-5",
        };

        return checkDetectedElem({ list: actions, ind, indFromLast: 5 }) ? (
            <div {...props} ref={detectedCard}>
                {showAccordion({ panel })}
            </div>
        ) : (
            <div {...props}>{showAccordion({ panel })}</div>
        );
    });

    return <div className={classes.root}>{ActionsMap}</div>;
}
