import React from 'react';
import PropTypes from 'prop-types';
import isSmallScreen from '../../utils/isSmallScreen';
// material-ui
import TabSessions from '../../components/TabSessions';
import DashClients from './dash-clients';
// Icons from Tabs
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import BuildIcon from '@material-ui/icons/Build';
import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';
import Loadable from 'react-loadable';
import { useStoreState } from 'easy-peasy';
import FullPageLoading from '../../components/loadingIndicators/FullPageLoading';
// temp
import DashAppDesign from './dash-app-design';
// End Material UI
const muStyle = {
    fontSize: 35,
}

const DashAppDesignLazy = Loadable({
    loader: () => import(/* webpackChunkName: "dash-setting-lazy"*/ "./dash-app-design"),
    loading() {
        return <FullPageLoading />;
    }
})

const DashSettingLazy = Loadable({
    loader: () => import(/* webpackChunkName: "dash-setting-lazy"*/ "./dash-setting"),
    loading() {
        return <FullPageLoading />;
    }
})

let data;
const dataTab1 = [
    {
        tabLabel: "Clientes",
        tabIcon: <PermContactCalendarIcon style={muStyle} />,
        tabContentPanel: <DashClients />,
    },
    {
        tabLabel: "App",
        tabIcon: <PhonelinkSetupIcon style={muStyle} />,
        tabContentPanel: null,
        boxPadding: 1,
    },
    {
        tabLabel: "Ajustes",
        tabIcon: <BuildIcon style={muStyle} />,
        tabContentPanel: null,
    },
]

const dataTab2 = [
    {
        tabLabel: "Clientes",
        tabIcon: <PermContactCalendarIcon style={muStyle} />,
        tabContentPanel: null,
    },
    {
        tabLabel: "App",
        tabIcon: <PhonelinkSetupIcon style={muStyle} />,
        tabContentPanel: <DashAppDesign />,
        boxPadding: 1,
    },
    {
        tabLabel: "Ajustes",
        tabIcon: <BuildIcon style={muStyle} />,
        tabContentPanel: null,
        boxPadding: 1,
    },
]

const dataTab3 = [
    {
        tabLabel: "Clientes",
        tabIcon: <PermContactCalendarIcon style={muStyle} />,
        tabContentPanel: null,
    },
    {
        tabLabel: "App",
        tabIcon: <PhonelinkSetupIcon style={muStyle} />,
        tabContentPanel: null,
        boxPadding: 1,
    },
    {
        tabLabel: "Ajustes",
        tabIcon: <BuildIcon style={muStyle} />,
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
    } else if(runName === 2) {
        data = dataTab3;
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
    tabLabel: "Ajustes",
    tabIcon: <BuildIcon />,
    tabContentPanel: <DashSetting />
},
 */