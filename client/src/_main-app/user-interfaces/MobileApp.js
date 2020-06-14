import React, { Fragment } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

// LAYOUT
import Navbar from '../../components/_layout/navbar';

// PAGES
import AsyncLoginPage from '../../pages/auth/AsyncLoginPage'; // is it necessarybecauseit is only usedthe login compo inmobile app
import Default from '../../pages/Default';
import Dashboard from '../../pages/dashboard-admin';
import DashboardClientAdmin from '../../pages/dashboard-client-admin';
import AsyncPasswordPage from '../../pages/dashboard-client-admin/AsyncPasswordPage';
import ClientMobileApp from '../../pages/mobile-app/ClientMobileApp';
import AsyncLoyaltyScoreHandler from '../../pages/client/loyalty-client-scores/AsyncLoyaltyScoreHandler';
import RegulationPage from '../../pages/RegulationPage';
import AsyncAppSharer from '../../pages/app-sharer/AsyncAppSharer';
import PlansPage from '../../pages/plans-page/PlansPage';
//END PAGES

// COMPONENTS
import SnackbarMulti from '../../components/Snackbar';
import LinearProgress from '../../components/loadingIndicators/LinearProgress';
import PrivateRouteAdm from '../../components/auth/routes/PrivateRouteAdm';
import PrivateRouteClientAdm from '../../components/auth/routes/PrivateRouteClientAdm';

// This is the msg to be displayed for desktop users when popping up the
// new screen right after the download.
const InstallMsg = () => (
    <div className="text-center mt-5">
        <p className="text-white text-title">
            Seu App está sendo instalado!
        </p>
        <p className="text-white text-subtitle mx-2">
            Feche essa janela e abra o app direto da sua área de desktop
            assim que aparecer a mensagem de confirmação.
        </p>
    </div>
);

function Mobile({ location }) {
    const locationNow = location.pathname;

    return (
        <Fragment>
            <LinearProgress />
            {!(["/mobile-app", "/acesso/verificacao"]).includes(locationNow)
            ? (
                <Navbar />
            ) : null}
            <Switch>
                <Route path="/acesso/verificacao" exact component={AsyncLoginPage} />
                <Route path="/mobile-app" exact component={ClientMobileApp} />
                <Route path="/cliente/pontos-fidelidade" exact component={AsyncLoyaltyScoreHandler} />
                <Route path="/regulamento/" exact component={RegulationPage} />
                <Route path="/:bizCodeName/nova-senha-verificacao" exact component={AsyncPasswordPage} />
                <Route path="/:bizCodeName/compartilhar-app" exact component={AsyncAppSharer} />
                <Route path="/baixe-app" exact component={InstallMsg} />
                <Route path="/baixe-app/:userName" component={InstallMsg} />
                <Route path="/planos" exact component={PlansPage} />
                <PrivateRouteClientAdm path="/:bizCodeName/cliente-admin/painel-de-controle" exact component={DashboardClientAdmin} />
                <Route component={Default} />
            </Switch>
            <SnackbarMulti />
        </Fragment>
    );
}

export default withRouter(Mobile);

/* ARCHIVES
<PrivateRouteAdm path="/admin/painel-de-controle" exact component={Dashboard} />

import ChangePassword from '../../pages/client/ChangePassword';
import InsertNewPassword from '../../pages/client/InsertNewPassword';
import ConfirmAccount from '../../pages/client/ConfirmAccount';
 */