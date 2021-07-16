import { useMemo, Fragment, useEffect } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { useGlobalContext } from "context";
import loadInit from "auth/api";
import PrivateRouteClientAdm from "components/auth/routes/PrivateRouteClientAdm";
import { Load } from "components/code-splitting/LoadableComp";
// PAGES
import ClientMobileApp from "pages/mobile-app/ClientMobileApp";
import RegulationPage from "pages/RegulationPage";
import Default from "pages/Default";
import UnavailableService from "pages/UnavailableService";
import {
    AsyncLoginPage,
    // cli-admin
    AsyncDashboardClientAdmin,
    AsyncOrdersAndPay,
    AsyncAppSharer,
    AsyncPlansPage,
    // end cli-admin
    AsyncAccessPassword,
    AsyncNewPassword,
    AsyncFixDatePage,
    AsyncPasswordPage,
    AsyncTeamPassword,
    AsyncTeamApp,
    AsyncVirtualCard,
    AsyncPointsPanel,
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
    AsyncAmurretoAltrabot,
} from "./CommonImports";
// END PAGES

const AsyncNavBar = Load({
    loading: false,
    loader: () =>
        import(
            "components/_layout/navbar" /* webpackChunkName: "main-navbar-lazy" */
        ),
});

// This is the msg to be displayed for desktop users when popping up the
// new screen right after the download.
const InstallMsg = () => (
    <div className="text-center mt-5">
        <p className="text-white text-title">Seu App está sendo instalado!</p>
        <p className="text-white text-subtitle mx-2">
            Feche essa janela e abra o app direto da sua área de desktop assim
            que aparecer a mensagem de confirmação.
        </p>
    </div>
);

function Mobile({ location }) {
    const locationNow = location.pathname;

    const { uify } = useGlobalContext();

    // eslint-disable-next-line
    const setUify = useMemo(() => uify, []);

    useEffect(() => {
        loadInit(setUify);
        // eslint-disable-next-line
    }, [setUify]);

    return (
        <Fragment>
            {!["/mobile-app", "/acesso/verificacao"].includes(locationNow) ? (
                <AsyncNavBar />
            ) : null}
            <Switch>
                <Route
                    path="/acesso/verificacao"
                    exact
                    component={AsyncLoginPage}
                />
                <Route path="/mobile-app" exact component={ClientMobileApp} />
                <Route
                    path="/cliente/pontos-fidelidade"
                    exact
                    component={AsyncPointsPanel}
                />
                <Route path="/regulamento/" exact component={RegulationPage} />
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
                <Route path="/baixe-app" exact component={InstallMsg} />
                <Route
                    path="/baixe-app/:userName"
                    exact
                    component={InstallMsg}
                />
                <Route path="/planos" exact component={AsyncPlansPage} />
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
                <Route
                    path="/amurreto/altrabot"
                    exact
                    component={AsyncAmurretoAltrabot}
                />
                <Route component={Default} />
            </Switch>
        </Fragment>
    );
}

export default withRouter(Mobile);

/* ARCHIVES
import ChangePassword from 'pages/client/ChangePassword';
import InsertNewPassword from 'pages/client/InsertNewPassword';
import ConfirmAccount from 'pages/client/ConfirmAccount';
 */
