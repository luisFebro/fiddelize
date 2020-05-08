import React, { Fragment } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import FullPageLoading from '../../components/loadingIndicators/FullPageLoading';

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
// import Home from '../../pages/Home';
// import LoginPage from '../../pages/LoginPage';
import Home from '../../pages/Home';
import Default from '../../pages/Default';
import Dashboard from '../../pages/dashboard-admin';
import DashboardClientAdmin from '../../pages/dashboard-client-admin';
import Loadable from 'react-loadable';
import LoyaltyScoreHandler from '../../pages/client/loyalty-client-scores';
import RegulationPage from '../../pages/RegulationPage';
import DownloadApp from '../../pages/DownloadApp';
import IntroPage from '../../pages/new-app';
import PasswordPage from '../../pages/dashboard-client-admin/PasswordPage';
import AppSharer from '../../pages/app-sharer/AppSharer';
import SelfServicePage from '../../pages/new-app/self-service/SelfServicePage';
import PlansPage from '../../pages/plans-page/PlansPage';
// DYNAMIC ASYNC IMPORT
const ClientAppPreview = import(/* webpackChunkName: "client-app-preview" */ '../../pages/mobile-app/ClientAppPreview');
const LoginPage = import(/* webpackChunkName: "login-page" */ '../../pages/LoginPage');
// END DYNAMIC ASYNC IMPORT


// Preloading a lazy component without blocking rendering.
const ClientAppPreviewLazy = React.lazy(() => ClientAppPreview);
const LoginPageLazy = React.lazy(() => LoginPage);
// const LoginPageLazy = Loadable({
    // loader: () => import(/* webpackChunkName: "login-page-lazy" */ '../../pages/LoginPage'),
    // loading() {
        // return <FullPageLoading />
    // }
// })
//END PAGES

function Website({ location }) {

    const locationNow = location.pathname;
    const dontNeedLayout = !locationNow.includes("/mobile-app/preview");

    return (
        <Fragment>
            <LinearProgress />
            {dontNeedLayout &&
            <Navbar />}
            <React.Suspense fallback={<div>...</div>}>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/acesso/verificacao" exact component={LoginPageLazy} />
                    <Route path="/cliente/pontos-fidelidade" exact component={LoyaltyScoreHandler} />
                    <Route path="/regulamento" exact component={RegulationPage} />
                    <Route path="/baixe-app/:userName" exact component={DownloadApp} />
                    <Route path="/baixe-app" exact component={DownloadApp} />
                    <Route path="/:bizCodeName/novo-app" exact component={IntroPage} />
                    <Route path="/:bizCodeName/novo-app/self-service/:bizId" exact component={SelfServicePage} />
                    <Route path="/:bizCodeName/nova-senha-verificacao" exact component={PasswordPage} />
                    <Route path="/:bizCodeName/compartilhar-app" exact component={AppSharer} />
                    <Route path="/planos" exact component={PlansPage} />
                    <Route path="/mobile-app/preview" component={ClientAppPreviewLazy} />
                    <PrivateRouteClientAdm path="/:bizCodeName/cliente-admin/painel-de-controle" exact component={DashboardClientAdmin} />
                    <PrivateRouteAdm path="/admin/painel-de-controle" exact component={Dashboard} />
                    <Route component={Default} />
                </Switch>
            </React.Suspense>
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