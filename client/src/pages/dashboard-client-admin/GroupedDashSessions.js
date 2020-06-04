import React from 'react';
import PropTypes from 'prop-types';
import isSmallScreen from '../../utils/isSmallScreen';
// material-ui
import TabSessions from '../../components/TabSessions';
// Icons from Tabs
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import BuildIcon from '@material-ui/icons/Build';
import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';
import DashClients from './dash-clients';
// import { AsyncDashAppDesign, AsyncDashSetting } from './AsyncDashComps';
import VAsyncAppDesign from './dash-app-design';
import VAsyncDashSetting from './dash-setting';

const muStyle = {
    fontSize: 35,
}

const data = [
    {
        tabLabel: "Clientes",
        tabIcon: <PermContactCalendarIcon style={muStyle} />,
        tabContentPanel: <DashClients />,
    },
    {
        tabLabel: "App",
        tabIcon: <PhonelinkSetupIcon style={muStyle} />,
        tabContentPanel: <VAsyncAppDesign />,
        boxPadding: 1,
    },
    {
        tabLabel: "Ajustes",
        tabIcon: <BuildIcon style={muStyle} />,
        tabContentPanel: <VAsyncDashSetting />,
        boxPadding: 1,
    },
]

export default function GroupedDashSessions() {
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
    tabLabel: "Ajustes",
    tabIcon: <BuildIcon />,
    tabContentPanel: <DashSetting />
},
 */