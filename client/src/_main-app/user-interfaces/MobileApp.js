import React, { Fragment } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';

// LAYOUT
import Navbar from '../../components/_layout/navbar';

// PAGES
import Home from '../../pages/Home';
import LoginPage from '../../pages/LoginPage';
import Default from '../../pages/Default';
import Dashboard from '../../pages/dashboard-admin';
import DashboardClientAdmin from '../../pages/dashboard-client-admin';
import ClientMobileApp from '../../pages/mobile-app/ClientMobileApp';
import LoyaltyScoreHandler from '../../pages/client/loyalty-client-scores';
import RegulationPage from '../../pages/RegulationPage';
//END PAGES

// COMPONENTS
import SnackbarMulti from '../../components/Snackbar';
import LinearProgress from '../../components/loadingIndicators/LinearProgress';
import PrivateRouteAdm from '../../components/auth/routes/PrivateRouteAdm';
import PrivateRouteClientAdm from '../../components/auth/routes/PrivateRouteClientAdm';

function Mobile({ location }) {
    const { role } = useStoreState(state => ({
        role: state.userReducer.cases.currentUser.role,
    }));

    const locationNow = location.pathname;

    return (
        <Fragment>
            <LinearProgress />
            {!(["/mobile-app", "/acesso/verificacao"]).includes(locationNow)
            ? (
                <Navbar />
            ) : null}
            <Switch>
                <Route path="/acesso/verificacao" exact component={LoginPage} />
                <Route path="/mobile-app" exact component={ClientMobileApp} />
                <Route path="/cliente/pontos-fidelidade" exact component={LoyaltyScoreHandler} />
                <Route path="/regulamento/" exact component={RegulationPage} />
                <PrivateRouteClientAdm path="/:bizCodeName/cliente-admin/painel-de-controle" exact component={DashboardClientAdmin} />
                <PrivateRouteAdm path="/admin/painel-de-controle" exact component={Dashboard} />
                <Route component={Default} />
            </Switch>
            <SnackbarMulti />
        </Fragment>
    );
}

export default withRouter(Mobile);

/* ARCHIVES
import ChangePassword from '../../pages/client/ChangePassword';
import InsertNewPassword from '../../pages/client/InsertNewPassword';
import ConfirmAccount from '../../pages/client/ConfirmAccount';
 */