import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// Customized Data
import { useStoreDispatch } from 'easy-peasy';
// import ModalBtn from './modal/select/ModalBtn';
import ButtonFab from '../../../components/buttons/material-ui/ButtonFab';
import { findAnItem } from '../../../redux/actions/globalActions';
import { showModalConfYesNo } from '../../../redux/actions/modalActions';
// End Customized Data

ExpansiblePanel.propTypes = {
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            mainHeading: PropTypes.string,
            secondaryHeading: PropTypes.string,
            hiddenContent: PropTypes.any
        })
    ).isRequired,
    ToggleButton: PropTypes.element,
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    statusAfterClick: PropTypes.bool,
};

const useStyles = makeStyles(theme => ({
    root: {
        width: window.Helper.isSmallScreen() ? '100%' : '80%',
        margin: 'auto',
    },
    heading: {
        fontSize: '1em',
        fontWeight: 'bold',
        flexBasis: '33.33%',
        flexShrink: 0,
        textShadow: '1px 1px 3px black'
    },
    secondaryHeading: {
        paddingLeft: '10px',
        fontSize: theme.typography.pxToRem(15),
        textShadow: '1px 1px 3px black'
    }
}));

export default function ExpansiblePanel({
    actions,
    backgroundColor,
    ToggleButton,
    color }) {

    const classes = useStyles();

    const dispatch = useStoreDispatch();
    // const [expanded, setExpanded] = React.useState(false);
    // const handleChange = panel => (event, isExpanded) => {
    //     setExpanded(isExpanded ? panel : false);
    // };

    const styles = {
        Accordion: {
            color: color,
            backgroundColor: backgroundColor, // default is paper color
            margin: '35px 0',
        },
        button: {
            transform: 'translate(-50%, -50%)'
        },
        iconContainer: {
            position: 'absolute',
            top: -10,
            left: 10
        },
        heading: {
            display: 'flex',
            alignItems: 'center',
        }

    }

    const showStatus = panel => (
        <div className="animated zoomIn delay-1s">
            <div className="disabledLink">
                <ButtonFab
                    top={-27}
                    left={90}
                    title={`Total: ${panel.staffBooking.staffBookingList.length} agendamentos`}
                    variant="extended"
                    fontWeight="bolder"
                    fontSize=".7em"
                    style={styles.button}
                    color="var(--mainWhite)"
                    backgroundColor="#7f8c8d"
                />
            </div>
        </div>
    );

    const showPanel = panel => (
        <AccordionSummary
            expandIcon={
                <div
                    style={styles.iconContainer}
                    className="enabledLink"
                >
                    {ToggleButton
                    ? ToggleButton
                    : <ExpandMoreIcon />
                    }
                </div>
            }
            aria-controls={`panel${panel._id}bh-content`}
            id={`panel${panel._id}bh-header`}
        >
            <Typography
                className={clsx(classes.heading, "text-title")}
                style={styles.heading}
            >
                {panel.mainHeading}
            </Typography>
            <Typography
                className={classes.secondaryHeading}
                style={styles.heading}
            >
                {panel.secondaryHeading}
            </Typography>
        </AccordionSummary>
    );

    const showHiddenPanel = panel => (
        <AccordionDetails>
            {panel.hiddenContent}
        </AccordionDetails>
    );

    return (
        <div className={classes.root}>
            {actions.map(panel => (
                <div
                    key={panel._id}
                    className="position-relative"
                >
                    <Accordion
                        TransitionProps={{ unmountOnExit: true }} // only render when the panel is opened
                        style={styles.Accordion}
                        className="disabledLink"
                    >
                        {showPanel(panel)}
                        {showHiddenPanel(panel)}
                    </Accordion>
                    {showStatus(panel)}
                </div>
            ))}
        </div>
    );
}
