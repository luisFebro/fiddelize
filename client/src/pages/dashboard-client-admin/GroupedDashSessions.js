import React from 'react';
import PropTypes from 'prop-types';
import isSmallScreen from '../../utils/isSmallScreen';
// material-ui
import TabSessions from '../../components/TabSessions';
// Icons from Tabs
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import BuildIcon from '@material-ui/icons/Build';
import ChatIcon from '@material-ui/icons/Chat';
import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';
import DashClients from './dash-clients';
// import { AsyncDashAppDesign, AsyncDashSetting } from './AsyncDashComps';
import LoadableVisible from '../../components/code-splitting/LoadableVisible';

const AsyncAppDesign = LoadableVisible({ loader: () => import('./dash-app-design'  /* webpackChunkName: "cli-admin-app-design-session-lazy" */ )});
const AsyncSMS = LoadableVisible({ loader: () => import('./dash-sms'  /* webpackChunkName: "cli-admin-sms-session-lazy" */ )});
const AsyncDashSetting = LoadableVisible({ loader: () => import('./dash-setting'  /* webpackChunkName: "cli-admin-settings-session-lazy" */ )});

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
        tabLabel: "Ajustes",
        tabIcon: <BuildIcon style={muStyle} />,
        tabContentPanel: <AsyncDashSetting />,
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