import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import TabSessions from "../../components/tabs/TabSessions";
import DashUsers from "./dash-users";
// Icons from Tabs
// End Material UI

const data = [
    {
        tabLabel: "Usuários Gerenciamento",
        tabIcon: <SupervisedUserCircleIcon />,
        tabContentPanel: <DashUsers />,
    },
];

export default function GroupedDashSessions() {
    return <TabSessions data={data} />;
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
    tabLabel: "Configurações",
    tabIcon: <BuildIcon />,
    tabContentPanel: <DashSetting />
},
 */
