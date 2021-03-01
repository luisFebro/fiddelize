// Icons from Tabs
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
// import BuildIcon from "@material-ui/icons/Build";
import TabSessions from "../../../components/tabs/TabSessions";
import DashSales from "./dash-sales/DashSales";
// import LoadableVisible from "../../../components/code-splitting/LoadableVisible";

// const AsyncAdjusts = LoadableVisible({
//     loader: () =>
//         import(
//             "./dash-setting/DashSetting" /* webpackChunkName: "biz-team-setting-session-lazy" */
//         ),
// });

const muStyle = {
    fontSize: 35,
};

const data = [
    {
        tabLabel: "Ganhos Divulgação",
        tabIcon: <MonetizationOnIcon style={muStyle} />,
        tabContentPanel: <DashSales />,
    },
];

export default function GroupedDashSessions() {
    return <TabSessions data={data} needTabFullWidth />;
}

/*
{
    tabLabel: "Ajustes",
    tabIcon: <BuildIcon style={muStyle} />,
    tabContentPanel: <AsyncAdjusts />,
    boxPadding: 1,
},
 */
