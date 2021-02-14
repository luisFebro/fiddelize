// Icons from Tabs
import PermContactCalendarIcon from "@material-ui/icons/PermContactCalendar";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import BuildIcon from "@material-ui/icons/Build";
import ChatIcon from "@material-ui/icons/Chat";
import PhonelinkSetupIcon from "@material-ui/icons/PhonelinkSetup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadableVisible from "../../components/code-splitting/LoadableVisible";
import TabSessions from "../../components/tabs/TabSessions";
import DashClients from "./dash-clients";

const AsyncTeam = LoadableVisible({
    loader: () =>
        import(
            "./dash-team" /* webpackChunkName: "cli-admin-app-team-session-lazy" */
        ),
});
const AsyncAppDesign = LoadableVisible({
    loader: () =>
        import(
            "./dash-app-design" /* webpackChunkName: "cli-admin-app-design-session-lazy" */
        ),
});
const AsyncSMS = LoadableVisible({
    loader: () =>
        import(
            "./dash-sms" /* webpackChunkName: "cli-admin-sms-session-lazy" */
        ),
});
const AsyncDashSetting = LoadableVisible({
    loader: () =>
        import(
            "./dash-setting" /* webpackChunkName: "cli-admin-settings-session-lazy" */
        ),
});
const AsyncPro = LoadableVisible({
    loader: () =>
        import(
            "./dash-pro" /* webpackChunkName: "cli-admin-pro-session-lazy" */
        ),
});

const muStyle = {
    fontSize: 35,
};

const data = [
    {
        tabLabel: "Clientes",
        tabIcon: <PermContactCalendarIcon style={muStyle} />,
        tabContentPanel: <DashClients />,
    },
    {
        tabLabel: "Equipe",
        tabIcon: <PeopleAltIcon style={muStyle} />,
        tabContentPanel: <AsyncTeam />,
        boxPadding: 1,
    },
    {
        tabLabel: "App",
        tabIcon: <PhonelinkSetupIcon style={muStyle} />,
        tabContentPanel: <AsyncAppDesign />,
        boxPadding: 1,
    },
    {
        tabLabel: "SMS",
        tabIcon: <ChatIcon style={muStyle} />,
        tabContentPanel: <AsyncSMS />,
        boxPadding: 1,
    },
    {
        tabLabel: "Pro",
        tabIcon: (
            <FontAwesomeIcon
                icon="crown"
                style={{ ...muStyle, fontSize: 30 }}
            />
        ),
        tabContentPanel: <AsyncPro />,
        boxPadding: 1,
    },
    {
        tabLabel: "Ajustes",
        tabIcon: <BuildIcon style={muStyle} />,
        tabContentPanel: <AsyncDashSetting />,
        boxPadding: 1,
    },
];

export default function GroupedDashSessions() {
    return <TabSessions data={data} needTabFullWidth={false} />;
}

/* ARCHIVES
import DashClients from './dash-clients';
import DashBooking from './dash-booking';
import DashSetting from './dash-setting';
import DashFinance from './dash-finance';

import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import BuildIcon from '@material-ui/icons/Build';

{
    tabLabel: "Clientes",
    tabIcon: <PermContactCalendarIcon />,
    tabContentPanel: <DashClients />
},
{
    tabLabel: "Usuários Gerenciamento",
    tabIcon: <SupervisedUserCircleIcon />,
    tabContentPanel: <DashUsers />
},
{
    tabLabel: "Agendamentos",
    tabIcon: <LibraryBooksIcon />,
    tabContentPanel: <DashBooking />
},
{
    tabLabel: "Finanças",
    tabIcon: <MonetizationOnIcon />,
    tabContentPanel: <DashFinance />
},
{
    tabLabel: "Ajustes",
    tabIcon: <BuildIcon />,
    tabContentPanel: <DashSetting />
},
 */
