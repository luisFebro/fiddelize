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
import ButtonFab from '../../components/buttons/material-ui/ButtonFab';
import './ExpansiblePanel.scss';
// End Customized Data

const isSmall = window.Helper.isSmallScreen();

ExpansiblePanel.propTypes = {
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            mainHeading: PropTypes.object, // parser
            secondaryHeading: PropTypes.object, // parser
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
        width: isSmall ? '100%' : '80%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '15px 0',
        margin: '10px 0',
    }
}));

export default function ExpansiblePanel({
    actions,
    backgroundColor,
    ToggleButton,
    color,
    setRun,
    run,
    statusAfterClick }) {
    const classes = useStyles();

    const dispatch = useStoreDispatch();

    const styles = {
        expansionPanel: {
            color: color,
            backgroundColor: backgroundColor, // default is paper color
            margin: '25px 0',
        },
    }

    const showPanel = panel => (
        <ExpansionPanelSummary
            expandIcon={
                <div
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
                <Typography
                    className="ex-pa--headings"
                >
                    {panel.secondaryHeading}
                </Typography>
            </Fragment>
            )}
        </ExpansionPanelSummary>
    );

    const showHiddenPanel = panel => (
        <ExpansionPanelDetails>
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
                        className="disabledLink"
                        style={styles.expansionPanel}
                    >
                        {showPanel(panel)}
                        {showHiddenPanel(panel)}
                    </ExpansionPanel>
                </div>
            ))}
        </div>
    );
}
