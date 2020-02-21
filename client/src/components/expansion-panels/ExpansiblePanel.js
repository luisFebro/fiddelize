import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';

ExpansiblePanel.propTypes = {
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            panelInd: PropTypes.number,
            mainTitle: PropTypes.string,
            secondaryHeading: PropTypes.string,
            hiddenContent: PropTypes.any
        }).isRequired
    )
};

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        padding: '20px 0'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0
    },
    secondaryHeading: {
        paddingLeft: '10px',
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary
    }
}));

export default function ExpansiblePanel({ actions }) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div className={classes.root}>
            {actions.map(panel => (
                <ExpansionPanel
                    key={panel.id}
                    expanded={expanded === `panel${panel.id}`}
                    onChange={handleChange(`panel${panel.id}`)}
                >
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${panel.id}bh-content`}
                        id={`panel${panel.id}bh-header`}
                    >
                        <Typography className={classes.heading}>{panel.mainHeading}</Typography>
                        <Typography className={classes.secondaryHeading}>{panel.secondaryHeading}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>{panel.hiddenContent}</ExpansionPanelDetails>
                </ExpansionPanel>
            ))}
        </div>
    );
}
