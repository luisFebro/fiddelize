import { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PropTypes from "prop-types";
import "./ExpansiblePanel.scss";
// End Customized Data

const isSmall = window.Helper.isSmallScreen();

ExpansiblePanel.propTypes = {
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            mainHeading: PropTypes.object, // parser
            secondaryHeading: PropTypes.object, // parser
            hiddenContent: PropTypes.any,
        })
    ).isRequired,
    ToggleButton: PropTypes.element,
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    statusAfterClick: PropTypes.bool,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: isSmall ? "100%" : "80%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        padding: "15px 0",
        margin: "10px 0",
    },
}));

export default function ExpansiblePanel({
    actions,
    backgroundColor,
    ToggleButton,
    color,
    setRun,
    run,
    statusAfterClick,
}) {
    const classes = useStyles();

    const styles = {
        Accordion: {
            color,
            backgroundColor, // default is paper color
            margin: "25px 0",
        },
    };

    const showPanel = (panel) => (
        <AccordionSummary
            expandIcon={
                <div className="enabledLink">
                    {ToggleButton || <ExpandMoreIcon />}
                </div>
            }
            aria-controls={`panel${panel._id}bh-content`}
            id={`panel${panel._id}bh-header`}
        >
            {isSmall ? (
                <div className="d-flex flex-column align-self-start">
                    {panel.mainHeading}
                    {panel.secondaryHeading}
                </div>
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
    );

    const showHiddenPanel = (panel) => (
        <AccordionDetails>{panel.hiddenContent}</AccordionDetails>
    );

    return (
        <div className={classes.root}>
            {actions.map((panel) => (
                <div key={panel._id} className="position-relative">
                    <Accordion
                        className="disabledLink"
                        style={styles.Accordion}
                    >
                        {showPanel(panel)}
                        {showHiddenPanel(panel)}
                    </Accordion>
                </div>
            ))}
        </div>
    );
}
