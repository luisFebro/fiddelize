import React from 'react';
import isSmallScreen from '../utils/isSmallScreen';
// End Dash Sessions

// Material UI
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { green } from '@material-ui/core/colors';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`action-tabpanel-${index}`}
            aria-labelledby={`action-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `action-tab-${index}`,
        'aria-controls': `action-tabpanel-${index}`
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#f7f1e3',
        width: '100%',
        margin: 'auto',
        overflow: 'hidden',
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2)
    },
    fabGreen: {
        color: theme.palette.common.white,
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[600]
        }
    }
}));

TabSessions.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        tabLabel: PropTypes.string.isRequired,
        tabIcon: PropTypes.element.isRequired,
        tabContentPanel: PropTypes.element.isRequired,
    })),
    needTabFullWidth: PropTypes.bool,
}

export default function TabSessions({ data, needTabFullWidth = false }) {
    const { tabLabel, tabIcon, tabContentPanel } = data;
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = index => {
        setValue(index);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant={
                        needTabFullWidth
                        ? "fullWidth"
                        : (isSmallScreen() ? "scrollable" : "fullWidth")
                    }
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="scrollable force with icon"
                >
                    {data && data.map((tab, ind) => <Tab
                                                        key={ind}
                                                        label={tab.tabLabel}
                                                        icon={tab.tabIcon}
                                                        {...a11yProps(ind)}
                                                    />
                    )}
                </Tabs>
            </AppBar>
            {data && data.map((tab, ind) => {
                return(
                    <TabPanel
                        style={{overflow: 'hidden'}}
                        key={ind}
                        value={value}
                        index={ind}
                        dir={theme.direction}
                    >
                        {tab.tabContentPanel}
                    </TabPanel>
                );
            })}
        </div>
    );
}
