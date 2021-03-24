// Icons from Tabs
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import ContactPhoneIcon from "@material-ui/icons/ContactPhone";
// import BuildIcon from "@material-ui/icons/Build";
import TabSessions from "../../../components/tabs/TabSessions";
import DashSales from "./dash-sales/DashSales";
import LoadableVisible from "../../../components/code-splitting/LoadableVisible";

const AsyncDashCRM = LoadableVisible({
    loader: () =>
        import("./dash-crm/DashCRM" /* webpackChunkName: "crm-session-lazy" */),
});

const muStyle = {
    fontSize: 35,
};

const data = [
    {
        tabLabel: "Ganhos",
        tabIcon: <MonetizationOnIcon style={muStyle} />,
        tabContentPanel: <DashSales />,
    },
    {
        tabLabel: "Clientes",
        tabIcon: <ContactPhoneIcon style={muStyle} />,
        tabContentPanel: <AsyncDashCRM />,
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
