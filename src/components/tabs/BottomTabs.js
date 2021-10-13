import React, { useEffect, Fragment } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import getVar, { removeVar } from "init/var";
import getItems from "init/lStorage";
import useContext from "context";
import scrollIntoView from "../../utils/document/scrollIntoView";
import useDetectScrollSingle from "hooks/scroll/useDetectScrollSingle";
import "./_BottomTabs.scss";

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

function a11yProps(index) {
    return {
        id: `action-tab-${index}`,
        "aria-controls": `action-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    selected: {
        fontFamily: "var(--mainFont)",
        fontWeight: "bold",
        color: ({ color }) =>
            color
                ? `var(--themePDark--${color}) !important`
                : "var(--themePLight) !important",
        fontSize: "1rem !important",
    },
    indicator: {
        backgroundColor: ({ color }) =>
            color
                ? `var(--themePDark--${color}) !important`
                : "var(--themePLight) !important",
        height: "5px !important",
    },
}));

BottomTabs.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            tabLabel: PropTypes.string.isRequired,
            tabIcon: PropTypes.element.isRequired,
            tabContentPanel: PropTypes.any,
        })
    ),
    needTabFullWidth: PropTypes.bool,
};

export default function BottomTabs({
    data,
    needTabFullWidth = false,
    showAppBar = true,
    disableClick,
}) {
    const [mainColor] = getItems("bizData", ["themePColor"]);
    // themeBackColor for club maker front page
    const { themePColor } = useContext();
    const tabMainColor = themePColor || mainColor;

    const isAppTopDetected = useDetectScrollSingle("#topAppContent");

    const props = {
        color: tabMainColor,
    };

    const classes = useStyles(props);
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

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
        if (disableClick) return;
        setValue(newValue);

        // handle click actions
        const allowedScrollViewList = data.map((tab) => tab.scrollView);
        // scrollIntoView cause friction if user is in the bottom and there is a delay to reach the target spot to set the view. The fluid transaction should occur only when detecting the app is upper part in the screen
        if (allowedScrollViewList[newValue])
            scrollIntoView("#bottomTabContentView", {
                duration: isAppTopDetected ? 2000 : 0,
            });
        else {
            const { onClick } = data[newValue];
            if (typeof onClick === "function") onClick();
        }
    };

    return (
        <Fragment>
            {data &&
                data.map((tab, ind) => (
                    <section
                        key={ind}
                        className="bottom-tabs--root"
                        style={{
                            backgroundColor: tab.colorBack
                                ? `var(--themePDark--${tab.colorBack})`
                                : "var(--mainWhite)",
                        }}
                    >
                        <div
                            style={{ position: "relative" }}
                            id="bottomTabContentView"
                        />
                        <TabPanel
                            style={{
                                minHeight: "500px",
                                paddingBottom: "50px",
                            }}
                            value={value}
                            index={ind}
                            dir={theme.direction}
                            boxPadding={tab.boxPadding || " "}
                        >
                            {ind === value && tab.tabContentPanel}
                        </TabPanel>
                    </section>
                ))}
            {showAppBar && (
                <section className="bottom-tabs--root">
                    <AppBar position="fixed" color="default">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            variant={
                                needTabFullWidth ? "fullWidth" : "scrollable"
                            }
                            aria-label="bottom tabs"
                            className="animated fadeInUp delay-1s"
                            classes={{
                                indicator: classes.indicator,
                            }}
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
                </section>
            )}
        </Fragment>
    );
}
