import React from 'react';
import PropTypes from 'prop-types';
import isSmallScreen from '../../utils/isSmallScreen';
// material-ui
import TabSessions from '../../components/TabSessions';
import DashClients from './dash-clients';
// Icons from Tabs
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import BuildIcon from '@material-ui/icons/Build';
import NotificationBadge from '../../components/NotificationBadge';
import Loadable from 'react-loadable';
import { useStoreState } from 'easy-peasy';
import FullPageLoading from '../../components/loadingIndicators/FullPageLoading';
// End Material UI

const DashSettingLazy = Loadable({
    loader: () => import(/* webpackChunkName: "dash-setting-lazy"*/ "./dash-setting"),
    loading() {
        return <FullPageLoading />;
    }
})
const ClientIconWithBadge = ({ notifElemsArray }) => {
    notifElemsArray = [{first: 'year'}, {first: 'year'}, {first: 'year'}, {first: 'year'}]; //

    return(
        <NotificationBadge
            badgeNumber={notifElemsArray.length}
            right={-20}
            top={5}
        >
            <PermContactCalendarIcon />
        </NotificationBadge>
    );
}
let data;
const dataTab1 = [
    {
        tabLabel: "Clientes",
        tabIcon: <ClientIconWithBadge />,
        tabContentPanel: <DashClients />
    },
    {
        tabLabel: "Configurações",
        tabIcon: <BuildIcon />,
        tabContentPanel: null,
    },
]

const dataTab2 = [
    {
        tabLabel: "Clientes",
        tabIcon: <ClientIconWithBadge />,
        tabContentPanel: <DashClients />
    },
    {
        tabLabel: "Configurações",
        tabIcon: <BuildIcon />,
        tabContentPanel: <DashSettingLazy />,
        boxPadding: 1,
    },
]

export default function GroupedDashSessions() {
    const { runName } = useStoreState(state => ({
        runName: state.globalReducer.cases.runName,
    }));

    if(runName === 1) {
        data = dataTab2;
    } else {
        data = dataTab1;
    }

    return (
        <TabSessions
            data={data}
            needTabFullWidth={true}
        />
    );
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