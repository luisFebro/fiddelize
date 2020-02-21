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
import LoyaltyScoreHandler from '../../pages/client/loyalty-client-scores';
import Loadable from 'react-loadable';
//END PAGES

// COMPONENTS
import SnackbarMulti from '../../components/Snackbar';
import LinearProgress from '../../components/loadingIndicators/LinearProgress';
import PrivateRouteAdm from '../../components/auth/routes/PrivateRouteAdm';

// it is not working properly...
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
                <PrivateRouteAdm path="/admin/painel-de-controle" exact component={Dashboard} />
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