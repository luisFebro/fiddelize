import { useMemo, Fragment, useEffect } from "react";
import { useGlobalContext } from "context";
import loadInit from "auth/api";
import { Switch, Route, withRouter } from "react-router-dom";
import PrivateRouteClientAdm from "components/auth/routes/PrivateRouteClientAdm";
// LAYOUT
import Navbar from "components/_layout/navbar";
import Footer from "components/_layout/footer/Footer";
// END LAYOUT

// PAGES
import Home from "pages/home/Home";
import RegulationPage from "pages/RegulationPage";
import AsyncDownloadApp from "pages/download-app/AsyncDownloadApp";
import {
    AsyncBizInfo,
    AsyncRewardPlanner,
    AsyncSelfService,
    AsyncAdminRegister,
} from "./comp-pages/AsyncNewAppPages";
import RedirectLink from "pages/RedirectLink";
import Default from "pages/Default";
import UnavailableService from "pages/UnavailableService";
import { Load } from "components/code-splitting/LoadableComp";
import {
    AsyncLoginPage,
    // cli-admin
    AsyncDashboardClientAdmin,
    AsyncOrdersAndPay,
    AsyncAppSharer,
    // end cli-admin
    AsyncAccessPassword,
    AsyncNewPassword,
    AsyncFixDatePage,
    AsyncPasswordPage,
    AsyncTeamPassword,
    AsyncTeamApp,
    AsyncVirtualCard,
    AsyncScorePanel,
    AsyncPix,
    AsyncAppsPanel,
    // biz team comps
    AsyncBizTeam,
    AsyncAgentNewPassword,
    AsyncPayGatewayRegister,
    AsyncBizTeamPassword,
    AsyncFiddelizeCabin,
    AsyncCeoFinance,
    // biz docs and footer
    AsyncServicesStatus,
    AsyncTerms,
    AsyncPrivacyPolicy,
    // test
    AsyncPlayground,
    // exclusive website
    AsyncClientAppPreview,
} from "./CommonImports";
// END PAGES

const AsyncQrCode = Load({
    loader: () =>
        import(
            "pages/others/QrCode" /* webpackChunkName: "free-qr-code-lazy" */
        ),
});

function Website({ location }) {
    const locationNow = location.pathname;
    const dontNeedLayout = !locationNow.includes("/mobile-app/preview");

    const { uify } = useGlobalContext();

    // eslint-disable-next-line
    const setUify = useMemo(() => uify, []);

    useEffect(() => {
        // loadReCaptcha();
        loadInit(setUify);
    }, [setUify]);

    return (
        <Fragment>
            {dontNeedLayout && <Navbar />}
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/de/:associateId" exact component={Home} />
                <Route
                    path="/acesso/verificacao"
                    exact
                    component={AsyncLoginPage}
                />
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
                    path="/novo-app/info-negocio"
                    exact
                    component={AsyncBizInfo}
                />
                <Route
                    path="/:bizLinkName/novo-app/metas"
                    exact
                    component={AsyncRewardPlanner}
                />
                <Route
                    path="/:bizLinkName/novo-app/self-service"
                    exact
                    component={AsyncSelfService}
                />
                <Route
                    path="/:bizLinkName/novo-app/cadastro-admin"
                    exact
                    component={AsyncAdminRegister}
                />
                <Route
                    path="/:bizLinkName/nova-senha-verificacao"
                    exact
                    component={AsyncPasswordPage}
                />
                <Route
                    path="/:bizLinkName/compartilhar-app"
                    exact
                    component={AsyncAppSharer}
                />
                <Route
                    path="/mobile-app/preview"
                    component={AsyncClientAppPreview}
                />
                <Route path="/app/:nameAndCode" component={RedirectLink} />
                <PrivateRouteClientAdm
                    path="/:bizLinkName/cliente-admin/painel-de-controle"
                    exact
                    component={AsyncDashboardClientAdmin}
                />
                <Route
                    path="/pedidos/admin"
                    exact
                    component={AsyncOrdersAndPay}
                />
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
                <Route
                    path="/t/app/nucleo-equipe/cabine-fiddelize"
                    exact
                    component={AsyncFiddelizeCabin}
                />
                <Route
                    path="/t/app/nucleo-equipe/financeiro/ceo"
                    exact
                    component={AsyncCeoFinance}
                />
                <Route path="/pix" exact component={AsyncPix} />
                <Route
                    path="/painel-de-apps"
                    exact
                    component={AsyncAppsPanel}
                />
                <Route path="/termos-de-uso" exact component={AsyncTerms} />
                <Route
                    path="/privacidade"
                    exact
                    component={AsyncPrivacyPolicy}
                />
                <Route
                    path="/status-de-servicos"
                    exact
                    component={AsyncServicesStatus}
                />
                <Route
                    path="/test/playground"
                    exact
                    component={AsyncPlayground}
                />
                <Route path="/codigo/qr" exact component={AsyncQrCode} />
                <Route component={Default} />
            </Switch>
            {dontNeedLayout && <Footer />}
        </Fragment>
    );
}

export default withRouter(Website);

/* ARCHIVES

import ChangePassword from 'pages/client/ChangePassword';
import ConfirmAccount from 'pages/client/ConfirmAccount';
<Route path="/cliente/trocar-senha" exact component={ChangePassword} />
<Route path="/cliente/confirmacao-conta/:authUserId" exact component={ConfirmAccount} />


 */
