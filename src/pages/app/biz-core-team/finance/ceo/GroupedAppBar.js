import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import BottomTabs from "../../../../../components/tabs/BottomTabs";
import SessionOut from "./session-out/SessionOut";
import LoadableVisible from "../../../../../components/code-splitting/LoadableComp";

const AsyncSessionIn = LoadableVisible({
    loader: () =>
        import(
            "./session-in/SessionIn" /* webpackChunkName: "in-app-bar-session-lazy" */
        ),
});

export default function GroupedAppBar({ handleBalance, handleNewCostValue }) {
    const data = [
        {
            tabLabel: "Saída",
            tabIcon: <ArrowDownwardIcon />,
            tabContentPanel: (
                <SessionOut
                    handleBalance={handleBalance}
                    handleNewCostValue={handleNewCostValue}
                />
            ),
        },
        {
            tabLabel: "Entrada",
            tabIcon: <ArrowUpwardIcon />,
            tabContentPanel: <AsyncSessionIn handleBalance={handleBalance} />,
        },
    ];

    return <BottomTabs data={data} needTabFullWidth />;
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
