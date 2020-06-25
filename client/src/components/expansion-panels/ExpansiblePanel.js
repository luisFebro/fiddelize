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
            _id: PropTypes.string,
            userData: PropTypes.object,
            mainHeading: PropTypes.oneOfType([Proptypes.element, Proptypes.string]),
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
        paddingLeft: '15px',
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary
    }
}));

export default function ExpansiblePanel({ actions }) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const styles = {
        headings: {
            display: 'flex',
            alignItems: 'center',
        }
    }

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const expandedIcon = <ExpandMoreIcon />;
    return (
        <div className={classes.root}>
            {actions.map(panel => (
                <ExpansionPanel
                    key={panel.id}
                    expanded={expanded === `panel${panel.id}`}
                    onChange={handleChange(`panel${panel.id}`)}
                    TransitionProps={{ unmountOnExit: true }}
                >
                    <ExpansionPanelSummary
                        expandIcon={expandedIcon}
                        aria-controls={`panel${panel.id}bh-content`}
                        id={`panel${panel.id}bh-header`}
                    >
                        <Typography
                            className={clsx(classes.heading)}
                            style={styles.headings}
                        >
                            {panel.mainHeading}
                        </Typography>
                        <Typography
                            className={classes.secondaryHeading}
                            style={styles.headings}
                        >
                            {panel.secondaryHeading}
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>{panel.hiddenContent}</ExpansionPanelDetails>
                </ExpansionPanel>
            ))}
        </div>
    );
}
