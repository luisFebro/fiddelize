import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "./_FaqAccordion.scss";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

/*
LazyLoadingContent:
The content of Accordions is mounted by default even if the accordion is not expanded. This default behavior has server-side rendering and SEO in mind. If you render expensive component trees inside your accordion details or simply render many accordions it might be a good idea to change this default behavior by enabling the unmountOnExit in TransitionProps:
<Accordion TransitionProps={{ unmountOnExit: true }} />
 */

export default function FaqAccordion({ dataArray, lazyLoading = false }) {
    const classes = useStyles();

    return (
        <div id="faq-accordion--root" className={classes.root}>
            {dataArray.map((panel, ind) => (
                <Accordion
                    key={ind}
                    TransitionProps={{ unmountOnExit: lazyLoading }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${ind + 1}a-content`}
                        id={`panel${ind + 1}a-header`}
                    >
                        <Typography className={classes.heading}>
                            {panel.title}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>{panel.text}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
}
