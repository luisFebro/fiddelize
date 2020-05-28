import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Customized Data
import { useStoreDispatch } from 'easy-peasy';
import './ExpansiblePanel.scss';
import ToggleBtn from './ToggleBtn';
// End Customized Data

const isSmall = window.Helper.isSmallScreen();

ConfigExpansiblePanel.propTypes = {
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
    statusAfterClick: PropTypes.bool,
    needToggleButton: PropTypes.bool,
};

const useStyles = makeStyles(theme => ({
    root: {
        width: isSmall ? '100%' : '80%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '15px 0',
        margin: isSmall ? '10px 0 0' : '10px 80px 0',
    }
}));

export default function ConfigExpansiblePanel({
    actions,
    backgroundColor,
    color,
    setRun,
    run,
    statusAfterClick,
    needToggleButton = false, }) {
    const classes = useStyles();

    const dispatch = useStoreDispatch();

    const styles = {
        expansionPanel: {
            color: color,
            backgroundColor: backgroundColor, // default is paper color
            margin: '5px 0',
        },
        muIcon: {
            transform: 'scale(2.7)',
            color: 'white',
            filter:  'drop-shadow(.5px .5px 1.5px black)',
        }
    }

    const showPanel = panel => (
        <ExpansionPanelSummary
            expandIcon={
                <div
                    className="enabledLink"
                >
                    {needToggleButton
                    ? (
                        <ToggleBtn
                            cardId={panel._id}
                        />
                    ) : <ExpandMoreIcon className="icon-mu" style={styles.muIcon} />}
                </div>
            }
            aria-controls={`panel${panel._id}bh-content`}
            id={`panel${panel._id}bh-header`}
        >
            {isSmall
            ? (
                <div className="d-flex flex-column align-self-start">
                    {panel.mainHeading}
                    {panel.secondaryHeading}
                </div>
            ) : (
            <Fragment>
                <Typography
                    className="ex-pa-main-heading ex-pa--headings"
                >
                    {panel.mainHeading}
                </Typography>
            </Fragment>
            )}
        </ExpansionPanelSummary>
    );

    const showHiddenPanel = panel => (
        <ExpansionPanelDetails style={{padding: '8px 0 24px', border: 'none'}}>
            {panel.hiddenContent}
        </ExpansionPanelDetails>
    );

    return (
        <div className={classes.root}>
            {actions.map(panel => (
                <div
                    key={panel._id}
                    className="position-relative"
                >
                    <ExpansionPanel
                        style={styles.expansionPanel}
                        TransitionProps={{ unmountOnExit: true }}
                    >
                        {showPanel(panel)}
                        {showHiddenPanel(panel)}
                    </ExpansionPanel>
                </div>
            ))}
        </div>
    );
}
