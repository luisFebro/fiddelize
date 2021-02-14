import PermContactCalendarIcon from "@material-ui/icons/PermContactCalendar";
import BuildIcon from "@material-ui/icons/Build";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import TabSessions from "../../components/TabSessions";
import DashClients from "./dash-clients";
import DashSetting from "./dash-setting";
import DashUsers from "./dash-users";
import DashBooking from "./dash-booking";
import DashFinance from "./dash-finance";
// Icons from Tabs
// End Material UI

const data = [
    {
        tabLabel: "Clientes",
        tabIcon: <PermContactCalendarIcon />,
        tabContentPanel: <DashClients />,
    },
    {
        tabLabel: "Usuários Gerenciamento",
        tabIcon: <SupervisedUserCircleIcon />,
        tabContentPanel: <DashUsers />,
    },
    {
        tabLabel: "Agendamentos",
        tabIcon: <LibraryBooksIcon />,
        tabContentPanel: <DashBooking />,
    },
    {
        tabLabel: "Finanças",
        tabIcon: <MonetizationOnIcon />,
        tabContentPanel: <DashFinance />,
    },
    {
        tabLabel: "Configurações",
        tabIcon: <BuildIcon />,
        tabContentPanel: <DashSetting />,
    },
];

export default function GroupedDashSessions() {
    return <TabSessions data={data} />;
}
