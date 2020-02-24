import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';

// PAGES
import Home from '../../pages/Home';
import LoginPage from '../../pages/LoginPage';
import Default from '../../pages/Default';
import Dashboard from '../../pages/dashboard-admin';
import ClientMobileApp from '../../pages/mobile-app/ClientMobileApp';
import LoyaltyScoreHandler from '../../pages/client/loyalty-client-scores';
import RegulationPage from '../../pages/RegulationPage';
//END PAGES

// COMPONENTS
import SnackbarMulti from '../../components/Snackbar';
import LinearProgress from '../../components/loadingIndicators/LinearProgress';
import PrivateRouteAdm from '../../components/auth/routes/PrivateRouteAdm';

export default function Mobile() {
    const { role } = useStoreState(state => ({
        role: state.userReducer.cases.currentUser.role,
    }));

    return (
        <Fragment>
            <LinearProgress />
            <Switch>
                <Route path="/acesso/verificacao" exact component={LoginPage} />
                <Route path="/mobile-app" exact component={ClientMobileApp} />
                <PrivateRouteAdm path="/admin/painel-de-controle" exact component={Dashboard} />
                <Route component={Default} />
            </Switch>
            {role === "admin"
            ? (
                <SnackbarMulti />
            ) : null}
        </Fragment>
    );
}

/* ARCHIVES
import ChangePassword from '../../pages/client/ChangePassword';
import InsertNewPassword from '../../pages/client/InsertNewPassword';
import ConfirmAccount from '../../pages/client/ConfirmAccount';
 */