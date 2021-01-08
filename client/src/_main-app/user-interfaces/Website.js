import React, { Fragment, useEffect } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { useStoreDispatch } from "easy-peasy";
import { loadUser } from "../../redux/actions/authActions";
//LAYOUT
import Navbar from "../../components/_layout/navbar";
import Footer from "../../components/_layout/footer/Footer";
// END LAYOUT

// COMPONENTS
import SnackbarRedux from "../../components/Snackbar";
import LinearProgress from "../../components/loadingIndicators/LinearProgress";
import PrivateRouteAdm from "../../components/auth/routes/PrivateRouteAdm";
import PrivateRouteClientAdm from "../../components/auth/routes/PrivateRouteClientAdm";

// PAGES
import Home from "../../pages/home/Home";
import LoginPage from "../../pages/auth/LoginPage";
import Dashboard from "../../pages/dashboard-admin";
import DashboardClientAdmin from "../../pages/dashboard-client-admin";
import RegulationPage from "../../pages/RegulationPage";
import AsyncDownloadApp from "../../pages/download-app/AsyncDownloadApp";
import AsyncIntroPage from "../../pages/new-app";
import AsyncAppSharer from "../../pages/app-sharer/AsyncAppSharer";
import AsyncSelfServicePage from "../../pages/new-app/self-service/AsyncSelfServicePage";
import PlansPage from "../../pages/plans-page/PlansPage";
import OrdersAndPay from "../../pages/plans-page/orders-and-pay/OrdersAndPay";
import RedirectLink from "../../pages/RedirectLink";
import ClientAppPreview from "../../pages/mobile-app/ClientAppPreview";
import Default from "../../pages/Default";
import UnavailableService from "../../pages/UnavailableService";
import {
    AsyncAccessPassword,
    AsyncNewPassword,
    AsyncFixDatePage,
    AsyncPasswordPage,
    AsyncTeamPassword,
    AsyncTeamApp,
    AsyncVirtualCard,
    AsyncScorePanel,
    // biz team comps
    AsyncBizTeam,
    AsyncAgentNewPassword,
    AsyncPayGatewayRegister,
    AsyncBizTeamPassword,
} from "./CommonImports";
//END PAGES

function Website({ location, history }) {
    const locationNow = location.pathname;
    const dontNeedLayout = !locationNow.includes("/mobile-app/preview");

    const dispatch = useStoreDispatch();

    useEffect(() => {
        // loadReCaptcha();
        dispatch(loadUser(dispatch))(history);
    }, [dispatch]);

    return (
        <Fragment>
            <LinearProgress />
            {dontNeedLayout && <Navbar />}
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/acesso/verificacao" exact component={LoginPage} />
                <Route
                    path="/cliente/pontos-fidelidade"
                    exact
                    component={AsyncScorePanel}
                />
                <Route path="/regulamento" exact component={RegulationPage} />
                <Route
                    path="/baixe-app/:userName"
                    exact
                    component={AsyncDownloadApp}
                />
                <Route path="/baixe-app" exact component={AsyncDownloadApp} />
                <Route
                    path="/:bizCodeName/novo-app"
                    exact
                    component={AsyncIntroPage}
                />
                <Route
                    path="/:bizCodeName/novo-app/self-service/:bizId"
                    exact
                    component={AsyncSelfServicePage}
                />
                <Route
                    path="/:bizCodeName/nova-senha-verificacao"
                    exact
                    component={AsyncPasswordPage}
                />
                <Route
                    path="/:bizCodeName/compartilhar-app"
                    exact
                    component={AsyncAppSharer}
                />
                <Route path="/planos" exact component={PlansPage} />
                <Route
                    path="/mobile-app/preview"
                    component={ClientAppPreview}
                />
                <Route path="/app/:nameAndCode" component={RedirectLink} />
                <PrivateRouteClientAdm
                    path="/:bizCodeName/cliente-admin/painel-de-controle"
                    exact
                    component={DashboardClientAdmin}
                />
                <Route path="/pedidos/admin" exact component={OrdersAndPay} />
                <Route
                    path="/temporariamente-indisponivel-503"
                    exact
                    component={UnavailableService}
                />
                <Route
                    path="/conserte-data"
                    exact
                    component={AsyncFixDatePage}
                />
                <Route
                    path="/senha-de-acesso"
                    exact
                    component={AsyncAccessPassword}
                />
                <Route
                    path="/senha-equipe"
                    exact
                    component={AsyncTeamPassword}
                />
                <Route
                    path="/nova-senha/:token"
                    exact
                    component={AsyncNewPassword}
                />
                <Route path="/t/app/equipe" exact component={AsyncTeamApp} />
                <Route
                    path="/cartao-virtual"
                    exact
                    component={AsyncVirtualCard}
                />
                <Route
                    path="/t/app/nucleo-equipe"
                    exact
                    component={AsyncBizTeam}
                />
                <Route
                    path="/t/app/nucleo-equipe/cadastro/senha"
                    exact
                    component={AsyncAgentNewPassword}
                />
                <Route
                    path="/t/app/nucleo-equipe/cadastro/pagseguro"
                    exact
                    component={AsyncPayGatewayRegister}
                />
                <Route
                    path="/t/app/nucleo-equipe/acesso"
                    exact
                    component={AsyncBizTeamPassword}
                />
                <Route component={Default} />
            </Switch>
            <SnackbarRedux />
            {dontNeedLayout && <Footer />}
        </Fragment>
    );
}

export default withRouter(Website);

/* ARCHIVES
<PrivateRouteAdm path="/admin/painel-de-controle" exact component={Dashboard} />

import ChangePassword from '../../pages/client/ChangePassword';
import ConfirmAccount from '../../pages/client/ConfirmAccount';
<Route path="/cliente/trocar-senha" exact component={ChangePassword} />
<Route path="/cliente/confirmacao-conta/:authUserId" exact component={ConfirmAccount} />


 */
