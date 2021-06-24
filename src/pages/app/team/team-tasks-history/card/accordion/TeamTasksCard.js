import { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import "./Accordion.scss";
import ToggleBtn from "./ToggleBtn";

const isSmall = window.Helper.isSmallScreen();

TeamTasksCard.propTypes = {
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

export default function TeamTasksCard({
    detectedCard,
    checkDetectedElem,
    actions,
    needToggleButton = false,
}) {
    const classes = useStyles();

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
        </section>
    );

    const showHiddenPanel = (panel) => (
        <AccordionDetails>{panel.hiddenContent}</AccordionDetails>
    );

    const showAccordion = ({ panel }) => (
        <Accordion
            TransitionProps={{ unmountOnExit: true }}
            className="card-accordion disabledLink"
            style={{
                color: "var(--mainWhite)",
                backgroundColor: "var(--themePLight)",
                margin: "15px 0 0",
            }}
        >
            {showPanel(panel)}
            {showHiddenPanel(panel)}
        </Accordion>
    );

    const ActionsMap = actions.map((panel = {}, ind) => {
        const props = {
            key: panel._id || panel.cardId || ind,
            className: "position-relative mx-3 mt-3",
        };

        return checkDetectedElem({ list: actions, ind, indFromLast: 2 }) ? (
            <div {...props} ref={detectedCard}>
                {showAccordion({ panel })}
            </div>
        ) : (
            <div {...props}>{showAccordion({ panel })}</div>
        );
    });

    return <div className={classes.root}>{ActionsMap}</div>;
}
