import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import "./Accordion.scss";
import ToggleBtn from "./ToggleBtn";

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

export default function TradeCard({
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
                <section className="position-relative">
                    <div>{panel.mainHeading}</div>
                    {panel.secondaryHeading}
                </section>
            </AccordionSummary>
        </section>
    );

    // display need to be block instead of flex in order to read the table inside card
    const showHiddenPanel = (panel) => (
        <AccordionDetails>
            {panel.hiddenContent}
            <style jsx global>
                {`
                    .MuiAccordionDetails-root {
                        display: block;
                    }
                `}
            </style>
        </AccordionDetails>
    );

    const showAccordion = ({ panel }) => (
        <Accordion
            TransitionProps={{ unmountOnExit: true }}
            className="disabledLink"
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
