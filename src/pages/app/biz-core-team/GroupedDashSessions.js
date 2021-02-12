import React from "react";
// material-ui
import TabSessions from "../../../components/tabs/TabSessions";
// Icons from Tabs
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import BuildIcon from "@material-ui/icons/Build";
import DashSales from "./dash-sales/DashSales";
import LoadableVisible from "../../../components/code-splitting/LoadableVisible";

const AsyncAdjusts = LoadableVisible({
    loader: () =>
        import(
            "./dash-setting/DashSetting" /* webpackChunkName: "biz-team-setting-session-lazy" */
        ),
});

const muStyle = {
    fontSize: 35,
};

const data = [
    {
        tabLabel: "Vendas",
        tabIcon: <MonetizationOnIcon style={muStyle} />,
        tabContentPanel: <DashSales />,
    },
    {
        tabLabel: "Ajustes",
        tabIcon: <BuildIcon style={muStyle} />,
        tabContentPanel: <AsyncAdjusts />,
        boxPadding: 1,
    },
];

export default function GroupedDashSessions() {
    return <TabSessions data={data} needTabFullWidth={true} />;
}
