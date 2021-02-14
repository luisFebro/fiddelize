import React, { useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import green from "@material-ui/core/colors/green";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import { useStoreDispatch } from "easy-peasy";
import { getVar, removeVar } from "../../hooks/storage/useVar";
// import { setRun } from '../redux/actions/globalActions';

const isSmall = window.Helper.isSmallScreen();

function TabPanel(props) {
    const { children, value, index, boxPadding, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`action-tabpanel-${index}`}
            aria-labelledby={`action-tab-${index}`}
            {...other}
        >
            <Box p={boxPadding || 3}>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `action-tab-${index}`,
        "aria-controls": `action-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#f7f1e3",
        width: "100%",
        margin: "auto",
        overflow: "hidden",
    },
    fab: {
        position: "absolute",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    fabGreen: {
        color: theme.palette.common.white,
        backgroundColor: green[500],
        "&:hover": {
            backgroundColor: green[600],
        },
    },
    selected: {
        fontFamily: "var(--mainFont)",
        fontWeight: "bold",
        color: "var(--themePLight) !important",
        fontSize: "0.95rem !important",
    },
}));

TabSessions.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            tabLabel: PropTypes.string.isRequired,
            tabIcon: PropTypes.element.isRequired,
            tabContentPanel: PropTypes.any,
        })
    ),
    needTabFullWidth: PropTypes.bool,
};

export default function TabSessions({ data, needTabFullWidth = false }) {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const dispatch = useStoreDispatch();

    useEffect(() => {
        // Programatically set user to one section when redirecting to dashboard.
        getVar("name_tabLabel").then((targetSection) => {
            if (targetSection) {
                data.map((tab, ind) => {
                    if (tab.tabLabel === targetSection) setValue(ind);
                    removeVar("name_tabLabel");
                });
            }
        });
    }, [data]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // const handleChangeIndex = index => {
    //     setValue(index);
    // };

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant={
                        needTabFullWidth
                            ? "fullWidth"
                            : isSmall
                            ? "scrollable"
                            : "fullWidth"
                    }
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="scrollable force with icon"
                >
                    {data &&
                        data.map((tab, ind) => (
                            <Tab
                                key={ind}
                                label={tab.tabLabel}
                                icon={tab.tabIcon}
                                {...a11yProps(ind)}
                                classes={{
                                    selected: classes.selected,
                                }}
                            />
                        ))}
                </Tabs>
            </AppBar>
            {data &&
                data.map((tab, ind) => (
                    <TabPanel
                        style={{ overflow: "hidden", minHeight: "500px" }}
                        key={ind}
                        value={value}
                        index={ind}
                        dir={theme.direction}
                        boxPadding={tab.boxPadding}
                    >
                        {tab.tabContentPanel}
                    </TabPanel>
                ))}
        </div>
    );
}
