import { Load } from "../../components/code-splitting/LoadableComp";
// All component pages which are using both in website and mobile app goes here in next updates...

// PASSWORDS
export const AsyncAccessPassword = Load({
    loader: () =>
        import(
            "../../pages/access-password/AccessPassword" /* webpackChunkName: "cli-admin-access-password-page-lazy" */
        ),
});
// recover and change
export const AsyncNewPassword = Load({
    loader: () =>
        import(
            "../../pages/access-password/NewPassword" /* webpackChunkName: "new-pass-page-lazy" */
        ),
});

export const AsyncTeamPassword = Load({
    loader: () =>
        import(
            "../../pages/access-password/team-password/TeamPassword" /* webpackChunkName: "team-password-page-lazy" */
        ),
});

// creation
export const AsyncPasswordPage = Load({
    loader: () =>
        import(
            "../../pages/dashboard-client-admin/pass-page/AsyncPasswordPage" /* webpackChunkName: "create-pass-page-lazy" */
        ),
});
// END PASSWORDS

export const AsyncFixDatePage = Load({
    loader: () =>
        import(
            "../../pages/AsyncFixDatePage" /* webpackChunkName: "fix-date-page-lazy" */
        ),
});

export const AsyncTeamApp = Load({
    loader: () =>
        import(
            "../../pages/app/team/TeamApp" /* webpackChunkName: "team-app-lazy" */
        ),
});

// CLIENT APP
export const AsyncVirtualCard = Load({
    loader: () =>
        import(
            "../../pages/client/virtual-card/VirtualCard" /* webpackChunkName: "virtual-card-page-lazy" */
        ),
});

// FIDELITY SCORES
export const AsyncScorePanel = Load({
    loader: () =>
        import(
            "../../pages/client/loyalty-client-scores" /* webpackChunkName: "client-score-panel-page-lazy" */
        ),
});

// PAY METHODS
export const AsyncPix = Load({
    loader: () =>
        import("../../pages/pix/Pix" /* webpackChunkName: "pix-page-lazy" */),
});

// BIZ TEAM APP
export const AsyncBizTeam = Load({
    loader: () =>
        import(
            "../../pages/app/biz-core-team/BizTeamApp" /* webpackChunkName: "biz-core-team-app-lazy" */
        ),
});

export const AsyncAgentNewPassword = Load({
    loader: () =>
        import(
            "../../pages/app/biz-core-team/register/AgentNewPassword" /* webpackChunkName: "biz-core-team-new-password-lazy" */
        ),
});

export const AsyncPayGatewayRegister = Load({
    loader: () =>
        import(
            "../../pages/app/biz-core-team/register/PayGatewayRegister" /* webpackChunkName: "biz-core-team-pay-gateway-register-lazy" */
        ),
});

export const AsyncBizTeamPassword = Load({
    loader: () =>
        import(
            "../../pages/app/biz-core-team/access/BizTeamPassword" /* webpackChunkName: "biz-core-team-access-lazy" */
        ),
});

// END BIZ TEAM APP

export const AsyncAppsPanel = Load({
    loader: () =>
        import(
            "../../pages/apps-painel/AppsPanel" /* webpackChunkName: "apps-panel-page-lazy" */
        ),
});

// BIZ DOCS AND FOOTER
// support
export const AsyncServicesStatus = Load({
    loader: () =>
        import(
            "../../pages/ServicesStatus" /* webpackChunkName: "services-status-page-lazy" */
        ),
});

// biz
export const AsyncTerms = Load({
    loader: () =>
        import("../../pages/Terms" /* webpackChunkName: "terms-page-lazy" */),
});

export const AsyncPrivacyPolicy = Load({
    loader: () =>
        import(
            "../../pages/PrivacyPolicy" /* webpackChunkName: "privacy-page-lazy" */
        ),
});
// END BIZ DOCS AND FOOTER

// TEST
export const AsyncPlayground = Load({
    loader: () =>
        import(
            "../../pages/test/Playground" /* webpackChunkName: "playground-lazy" */
        ),
});
// END TEST
