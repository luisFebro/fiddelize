import { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import DisplayExpiryCounter from "./DisplayExpiryCounter";
import "./Accordion.scss";
import ToggleBtn from "./ToggleBtn";
import usePro from "init/pro";
// import getDatesCountdown from "utils/dates/countdown/getDatesCountdown";
// import { isScheduledDate } from "utils/dates/dateFns";

const isSmall = window.Helper.isSmallScreen();

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
        color,
        backgroundColor,
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
});

const handleTransactionStatus = ({ panel }) => {
    const { transactionStatus } = panel.data;

    const isPaid =
        transactionStatus === "pago" || transactionStatus === "disponível";
    if (!transactionStatus) return "PENDENTE";
    if (isPaid) return "PAGO";

    return transactionStatus && transactionStatus.toUpperCase();
};

export default function InvestCard({
    detectedCard,
    checkDetectedElem,
    actions,
    needToggleButton = false,
}) {
    const { mainRef } = usePro();

    const classes = useStyles();
    const styles = getStyles({
        color: "var(--mainWhite)",
        backgroundColor: "var(--themePLight)",
    });

    const displayMainRefOrderBadge = () => (
        <div>
            <ButtonFab
                position="absolute"
                top={-20}
                right={140}
                disabled
                title="plano atual"
                variant="extended"
                fontWeight="bolder"
                fontSize=".4em"
                size="small"
                color="var(--mainWhite)"
                backgroundColor="var(--incomeGreen)"
            />
        </div>
    );

    const displayStatusBadge = (panel) => {
        const transactionStatus = handleTransactionStatus({ panel });

        const handleBack = () => {
            if (transactionStatus === "PENDENTE") return "grey";
            if (transactionStatus === "PAGO") return "var(--incomeGreen)";
            if (transactionStatus === "CANCELADO") return "var(--expenseRed)";
            return "var(--mainDark)";
        };

        return (
            <div>
                <ButtonFab
                    position="absolute"
                    top={-20}
                    right={0}
                    disabled
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

    const showPanel = (panel) => (
        <section>
            <AccordionSummary
                expandIcon={
                    <div className="enabledLink">
                        {needToggleButton && <ToggleBtn cardId={panel._id} />}
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
            {panel.data.reference === mainRef && displayMainRefOrderBadge()}
            {displayStatusBadge(panel)}
            <DisplayExpiryCounter panel={panel} />
        </section>
    );

    const showHiddenPanel = (panel) => (
        <AccordionDetails>{panel.hiddenContent}</AccordionDetails>
    );

    const showAccordion = ({ panel }) => (
        <Accordion
            TransitionProps={{ unmountOnExit: true }}
            className="disabledLink"
            style={styles.accordion}
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

/* ARCHIVES

const isBoleto = paymentMethod === "boleto";

const { planExpiringDate } = panel.data;
const daysLeft = !planExpiringDate ? null : getDatesCountdown(planExpiringDate);

if (isBoleto) {
    const isDuePay =
        !isScheduledDate(payDueDate, { isDashed: true }) &&
        transactionStatus !== "pago"; // for boleto
    if (isDuePay || (daysLeft === 0 && transactionStatus !== "pendente"))
        return "EXPIRADO";
}

 */
