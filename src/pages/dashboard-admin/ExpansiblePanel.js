import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PropTypes from "prop-types";
import clsx from "clsx";
// Customized Data
import { useStoreDispatch } from "easy-peasy";
import { default as SelectBtn } from "./modal-select/ModalBtn";
import { default as YesNoModalBtn } from "./modal-conf-yes-no/ModalBtn";
// End Customized Data

ExpansiblePanel.propTypes = {
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            mainHeading: PropTypes.string,
            secondaryHeading: PropTypes.string,
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
        width: window.Helper.isSmallScreen() ? "100%" : "80%",
        margin: "auto",
    },
    heading: {
        fontSize: "1em",
        fontWeight: "bold",
        flexBasis: "33.33%",
        flexShrink: 0,
        textShadow: "1px 1px 3px black",
    },
    secondaryHeading: {
        paddingLeft: "10px",
        fontSize: theme.typography.pxToRem(15),
        textShadow: "1px 1px 3px black",
    },
    mainHeading: {
        display: "flex",
        alignItems: "center",
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

    const dispatch = useStoreDispatch();

    const styles = {
        expansionPanelContainer: {
            position: "relative",
        },
        Accordion: {
            color,
            backgroundColor, // default is paper color
            margin: "35px 0",
        },
        iconContainer: {
            position: "absolute",
            top: -10,
            left: 10,
        },
        mainHeading: {
            display: "flex",
            alignItems: "center",
        },
    };

    const showUpperConfigBtns = (panel) =>
        statusAfterClick && (
            <div className="animated zoomIn">
                <YesNoModalBtn
                    button={{
                        iconFontAwesome: "fas fa-trash-alt",
                        backgroundColor: "#4834d4", // purple
                        iconMarginLeft: "0px",
                        size: "small",
                        top: -30,
                        left: 40,
                    }}
                    modalData={{
                        title: "Confirmação de Exclusão Usuário",
                        subTitle: `Confirme a exclusão do usuário:<br /><strong>${panel.userData.name.cap()}</strong> ?`,
                        itemData: panel.userData,
                    }}
                    setRun={setRun}
                    run={run}
                />
                <SelectBtn
                    button={{
                        title: "trocar tipo usuário",
                        variant: "extended",
                        top: -27,
                        left: 90,
                        backgroundColor: "grey",
                        iconFontAwesome: "fas fa-user-plus",
                    }}
                    modal={{
                        title: "Seleção de Nova Função",
                        txtBtn: "Alterar",
                        iconBtn: "fas fa-exchange-alt",
                        modalData: panel.userData,
                    }}
                    setRun={setRun}
                    run={run}
                />
            </div>
        );

    const showPanel = (panel) => (
        <AccordionSummary
            expandIcon={
                <div style={styles.iconContainer} className="enabledLink">
                    {ToggleButton || <ExpandMoreIcon />}
                </div>
            }
            aria-controls={`panel${panel._id}bh-content`}
            id={`panel${panel._id}bh-header`}
        >
            <Typography
                className={clsx(classes.heading, "text-title")}
                style={styles.mainHeading}
            >
                {panel.mainHeading}
            </Typography>
            <Typography className={classes.secondaryHeading}>
                {panel.secondaryHeading}
            </Typography>
        </AccordionSummary>
    );

    const showHiddenPanel = (panel) => (
        <AccordionDetails>{panel.hiddenContent}</AccordionDetails>
    );

    return (
        <div className={classes.root}>
            {actions.map((panel) => (
                <div key={panel._id} style={styles.expansionPanelContainer}>
                    <Accordion
                        style={styles.Accordion}
                        className="disabledLink"
                    >
                        {showPanel(panel)}
                        {showHiddenPanel(panel)}
                    </Accordion>
                    {showUpperConfigBtns(panel)}
                </div>
            ))}
        </div>
    );
}
