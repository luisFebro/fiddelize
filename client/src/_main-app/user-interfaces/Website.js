import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';

//LAYOUT
import Navbar from '../../components/_layout/navbar';
import Footer from '../../components/_layout/footer/Footer';
// END LAYOUT

// PAGES
// import Home from '../../pages/Home';
// import LoginPage from '../../pages/LoginPage';
import Default from '../../pages/Default';
import Dashboard from '../../pages/dashboard-admin';
import DashboardClientAdmin from '../../pages/dashboard-client-admin';
import Loadable from 'react-loadable';
import LoyaltyScoreHandler from '../../pages/client/loyalty-client-scores';
import RegulationPage from '../../pages/RegulationPage';
import DownloadApp from '../../pages/DownloadApp';
import CreationPage from '../../pages/new-app';

// COMPONENTS
import SnackbarMulti from '../../components/Snackbar';
import LinearProgress from '../../components/loadingIndicators/LinearProgress';
import PrivateRouteAdm from '../../components/auth/routes/PrivateRouteAdm';
import PrivateRouteClientAdm from '../../components/auth/routes/PrivateRouteClientAdm';

// it is not working properly... Try implement a solution with switch and match to check the current param of the page...
const Home = Loadable({
    loader: () => import(/* webpackChunkName: "home" */ '../../pages/Home'),
    loading() {
        return <div>Loading...</div>
    }
})
const LoginPage = Loadable({
    loader: () => import(/* webpackChunkName: "loginpage" */ '../../pages/LoginPage'),
    loading() {
        return <div>Loading...</div>
    }
})
//END PAGES

export default function  Website() {
    const { role } = useStoreState(state => ({
        role: state.userReducer.cases.currentUser.role,
    }));

    return (
        <Fragment>
            <LinearProgress />
            <Navbar />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/acesso/verificacao" exact component={LoginPage} />
                <Route path="/cliente/pontos-fidelidade" exact component={LoyaltyScoreHandler} />
                <Route path="/regulamento" exact component={RegulationPage} />
                <Route path="/baixe-app/:userName" exact component={DownloadApp} />
                <Route path="/novo-app" exact component={CreationPage} />
                <PrivateRouteAdm path="/admin/painel-de-controle" exact component={Dashboard} />
                <PrivateRouteClientAdm path="/:bizName/cliente-admin/painel-de-controle" exact component={DashboardClientAdmin} />
                <Route component={Default} />
            </Switch>
            <SnackbarMulti />
            <Footer />
        </Fragment>
    );
}

/* ARCHIVES
import ChangePassword from '../../pages/client/ChangePassword';
import ConfirmAccount from '../../pages/client/ConfirmAccount';
<Route path="/cliente/trocar-senha" exact component={ChangePassword} />
<Route path="/cliente/confirmacao-conta/:authUserId" exact component={ConfirmAccount} />


 */