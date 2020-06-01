import React, { Fragment } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

//LAYOUT
import Navbar from '../../components/_layout/navbar';
import Footer from '../../components/_layout/footer/Footer';
// END LAYOUT

// COMPONENTS
import SnackbarMulti from '../../components/Snackbar';
import LinearProgress from '../../components/loadingIndicators/LinearProgress';
import PrivateRouteAdm from '../../components/auth/routes/PrivateRouteAdm';
import PrivateRouteClientAdm from '../../components/auth/routes/PrivateRouteClientAdm';

// PAGES
import AsyncHome from '../../pages/home/AsyncHome';
import AsyncLoginPage from '../../pages/auth/AsyncLoginPage';
import Default from '../../pages/Default';
import Dashboard from '../../pages/dashboard-admin';
import DashboardClientAdmin from '../../pages/dashboard-client-admin';
import LoyaltyScoreHandler from '../../pages/client/loyalty-client-scores';
import RegulationPage from '../../pages/RegulationPage';
import AsyncDownloadApp from '../../pages/download-app/AsyncDownloadApp';
import AsyncIntroPage from '../../pages/new-app';
import PasswordPage from '../../pages/dashboard-client-admin/PasswordPage';
import AppSharer from '../../pages/app-sharer/AppSharer';
import AsyncSelfServicePage from '../../pages/new-app/self-service/AsyncSelfServicePage';
import PlansPage from '../../pages/plans-page/PlansPage';
import RedirectLink from '../../pages/RedirectLink';
import ClientAppPreview from '../../pages/mobile-app/ClientAppPreview';
//END PAGES

function Website({ location }) {

    const locationNow = location.pathname;
    const dontNeedLayout = !locationNow.includes("/mobile-app/preview");

    return (
        <Fragment>
            <LinearProgress />
            {dontNeedLayout &&
            <Navbar />}
            <Switch>
                <Route path="/" exact component={AsyncHome} />
                <Route path="/acesso/verificacao" exact component={AsyncLoginPage} />
                <Route path="/cliente/pontos-fidelidade" exact component={LoyaltyScoreHandler} />
                <Route path="/regulamento" exact component={RegulationPage} />
                <Route path="/baixe-app/:userName" exact component={AsyncDownloadApp} />
                <Route path="/baixe-app" exact component={AsyncDownloadApp} />
                <Route path="/:bizCodeName/novo-app" exact component={AsyncIntroPage} />
                <Route path="/:bizCodeName/novo-app/self-service/:bizId" exact component={AsyncSelfServicePage} />
                <Route path="/:bizCodeName/nova-senha-verificacao" exact component={PasswordPage} />
                <Route path="/:bizCodeName/compartilhar-app" exact component={AppSharer} />
                <Route path="/planos" exact component={PlansPage} />
                <Route path="/mobile-app/preview" component={ClientAppPreview} />
                <Route path="/app/:nameAndCode" component={RedirectLink} />
                <PrivateRouteClientAdm path="/:bizCodeName/cliente-admin/painel-de-controle" exact component={DashboardClientAdmin} />
                <PrivateRouteAdm path="/admin/painel-de-controle" exact component={Dashboard} />
                <Route component={Default} />
            </Switch>
            <SnackbarMulti />
            {dontNeedLayout &&
            <Footer />}
        </Fragment>
    );
}

export default withRouter(Website);

/* ARCHIVES
import ChangePassword from '../../pages/client/ChangePassword';
import ConfirmAccount from '../../pages/client/ConfirmAccount';
<Route path="/cliente/trocar-senha" exact component={ChangePassword} />
<Route path="/cliente/confirmacao-conta/:authUserId" exact component={ConfirmAccount} />


 */