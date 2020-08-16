import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Customized Data
import { isScheduledDate } from '../../../../../../../utils/dates/dateFns';
import { useStoreState } from 'easy-peasy';
import './Accordion.scss';
import ToggleBtn from './ToggleBtn';
import ButtonFab from '../../../../../../../components/buttons/material-ui/ButtonFab';
// End Customized Data

const isSmall = window.Helper.isSmallScreen();

SmsCard.propTypes = {
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            mainHeading: PropTypes.object, // parser
            secondaryHeading: PropTypes.object, // parser
            hiddenContent: PropTypes.any
        })
    ).isRequired,
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    needToggleButton: PropTypes.bool,
};

const useStyles = makeStyles(theme => ({
    root: {
        width: isSmall ? '100%' : '80%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '15px 0',
        margin: isSmall ? '10px 0 40px' : '10px 80px 40px',
    }
}));

const getStyles = ({ color, backgroundColor }) => ({
    accordion: {
        color: color,
        backgroundColor: backgroundColor,
        margin: '25px 0 0',
    },
    totalPrizesBadge: {
        top: 0,
        right: -33,
        borderRadius: '50px',
        backgroundColor: "var(--niceUiYellow)",
        border: '3px solid grey',
        zIndex: 10,
    },
    trophyPrizes: {
        right: 55,
        bottom: 85,
    },
});

export default function SmsCard({
    actions,
    needToggleButton = false, }) {

    const classes = useStyles();
    const styles = getStyles({ color: "var(--mainWhite)", backgroundColor: "var(--themePLight)" });

    // const dispatch = useStoreDispatch();

    const { runArray } = useStoreState(state => ({
       runArray: state.globalReducer.cases.runArray,
    }));

    const displayScheduledBadge = panel => {
        const isCanceled = panel.data.isCanceled;

        return(
            <div className="enabledLink">
                <ButtonFab
                    position="absolute"
                    top={-20}
                    right={0}
                    disabled={true}
                    title={isCanceled ? "CANCELADO" : "AGENDADO"}
                    variant="extended"
                    fontWeight="bolder"
                    fontSize=".6em"
                    color="var(--mainWhite)"
                    backgroundColor={isCanceled ? "var(--expenseRed)" : "var(--mainDark)"}
                />
            </div>
        );
    }

    const showPanel = panel => {
        const isCanceled = panel.data.isCanceled;
        const scheduledDate = panel.data.scheduledDate;
        const needScheduledBadge = (isScheduledDate(scheduledDate) || isCanceled);

        return(
            <section>
                <AccordionSummary
                    expandIcon={
                        <div
                            className="enabledLink"
                        >
                            {(needToggleButton && panel.data.cardType === "out") && (
                                <ToggleBtn
                                    cardId={panel._id}
                                />
                            )}
                        </div>
                    }
                    aria-controls={`panel${panel._id}bh-content`}
                    id={`panel${panel._id}bh-header`}
                >
                    {isSmall
                    ? (
                        <section className="position-relative">
                            <div>
                                {panel.mainHeading}
                            </div>
                            {panel.secondaryHeading}
                        </section>
                    ) : (
                    <Fragment>
                        <Typography
                            className="ex-pa-main-heading ex-pa--headings"
                        >
                            {panel.mainHeading}
                        </Typography>
                        <Typography
                            className="ex-pa--headings"
                        >
                            {panel.secondaryHeading}
                        </Typography>
                    </Fragment>
                    )}
                </AccordionSummary>
                {needScheduledBadge && displayScheduledBadge(panel)}
            </section>
        );
    }

    const showHiddenPanel = panel => (
        <AccordionDetails>
            {panel.hiddenContent}
        </AccordionDetails>
    );

    return (
        <div
            className={classes.root}
        >
            {actions.map(panel => (
                <div
                    key={panel._id}
                    className="position-relative mx-3 mb-5"
                >
                    <Accordion
                        TransitionProps={{ unmountOnExit: true }}
                        className="disabledLink"
                        style={{ ...styles.accordion, backgroundColor: panel.data.cardType === "out" ? "var(--themePLight)" : "#00b894" }} // data mint green
                    >
                        {showPanel(panel)}
                        {showHiddenPanel(panel)}
                    </Accordion>
                </div>
            ))}
        </div>
    );
}
