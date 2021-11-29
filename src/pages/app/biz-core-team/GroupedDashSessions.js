// Icons from Tabs
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import ContactPhoneIcon from "@material-ui/icons/ContactPhone";
// import BuildIcon from "@material-ui/icons/Build";
import TabSessions from "components/tabs/TabSessions";
import LoadableVisible from "components/code-splitting/LoadableVisible";
import Icon from "styles/Icon";
import useData from "init";
import DashSales from "./dash-sales/DashSales";

const AsyncDashCRM = LoadableVisible({
    loader: () =>
        import("./dash-crm/DashCRM" /* webpackChunkName: "crm-session-lazy" */),
});

const AsyncSupportCenter = LoadableVisible({
    loader: () =>
        import(
            "./dash-support/SupportCenter" /* webpackChunkName: "support-center-session-lazy" */
        ),
});

const muStyle = {
    fontSize: 35,
};

const getData = ({ isDev }) => [
    {
        tabLabel: "Ganhos",
        tabIcon: <MonetizationOnIcon style={muStyle} />,
        tabContentPanel: <DashSales />,
    },
    {
        tabLabel: "Suporte",
        tabIcon: <Icon type="support" fill="grey" />,
        tabContentPanel: isDev ? <AsyncSupportCenter /> : null,
    },
    {
        tabLabel: "Clientes",
        tabIcon: <ContactPhoneIcon style={muStyle} />,
        tabContentPanel: <AsyncDashCRM />,
    },
];

export default function GroupedDashSessions() {
    const { agentJob } = useData();
    const isDev = agentJob === "dev";
    const data = getData({ isDev });
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
