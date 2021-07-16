import { Load } from "components/code-splitting/LoadableComp";
// All component pages which are using both in website and mobile app goes here in next updates...

export const AsyncLoginPage = Load({
    loader: () =>
        import(
            "auth/pages/LoginPage" /* webpackChunkName: "login-page-lazy" */
        ),
});

// CLI-ADMIN
export const AsyncDashboardClientAdmin = Load({
    loader: () =>
        import(
            "../../pages/dashboard-client-admin" /* webpackChunkName: "cli-admin-dashboard-lazy" */
        ),
});

export const AsyncOrdersAndPay = Load({
    loader: () =>
        import(
            "../../pages/plans-page/orders-and-pay/OrdersAndPay" /* webpackChunkName: "orders-and-pay-page-lazy" */
        ),
});

export const AsyncAppSharer = Load({
    loader: () =>
        import(
            "../../pages/app-sharer/AppSharer" /* webpackChunkName: "app-sharer-page-lazy" */
        ),
});

export const AsyncPlansPage = Load({
    loader: () =>
        import(
            "../../pages/plans-page/PlansPage" /* webpackChunkName: "plans-page-lazy" */
        ),
});
// END CLI-ADMIN

// PASSWORDS
export const AsyncAccessPassword = Load({
    loader: () =>
        import(
            "auth/pages/access-password/AccessPassword" /* webpackChunkName: "cli-admin-access-password-page-lazy" */
        ),
});
// recover and change
export const AsyncNewPassword = Load({
    loader: () =>
        import(
            "auth/pages/access-password/NewPassword" /* webpackChunkName: "new-pass-page-lazy" */
        ),
});

export const AsyncTeamPassword = Load({
    loader: () =>
        import(
            "auth/pages/access-password/team-password/TeamPassword" /* webpackChunkName: "team-password-page-lazy" */
        ),
});

// creation
export const AsyncPasswordPage = Load({
    loader: () =>
        import(
            "auth/pages/access-password/dashboard-client-admin/AsyncPasswordPage" /* webpackChunkName: "create-pass-page-lazy" */
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

// FIDELITY POINTS
// using webpackMode because the page is not loading due to err_content_decoding_failed 200
export const AsyncPointsPanel = Load({
    loader: () =>
        import(
            "../../pages/client/points-panel/AsyncPointsPanel" /* webpackMode: "eager", webpackChunkName: "client-points-panel-page-lazy" */
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
            "auth/pages/access-password/biz-core-team/BizTeamPassword" /* webpackChunkName: "biz-core-team-access-lazy" */
        ),
});

export const AsyncFiddelizeCabin = Load({
    loader: () =>
        import(
            "../../pages/app/biz-core-team/fiddelize-cabin/Cabin" /* webpackChunkName: "fiddelize-cabin-lazy" */
        ),
});

export const AsyncCeoFinance = Load({
    loader: () =>
        import(
            "../../pages/app/biz-core-team/finance/ceo/CeoFinance" /* webpackChunkName: "ceo-finance-lazy" */
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

// WEBSITE PLATFORM
export const AsyncClientAppPreview = Load({
    loader: () =>
        import(
            "../../pages/mobile-app/ClientAppPreview" /* webpackChunkName: "client-app-preview-comp-lazy" */
        ),
});
// END WEBSITE PLATFORM

// TEST
export const AsyncPlayground = Load({
    loader: () =>
        import(
            "../../pages/test/Playground" /* webpackChunkName: "playground-lazy" */
        ),
});
// END TEST

// AMURRETO
export const AsyncAmurretoAltrabot = Load({
    loader: () =>
        import(
            "../../pages/amurreto/altrabot/MainAltrabot" /* webpackChunkName: "amurreto-altrabot-lazy" */
        ),
});
// END AMURRETO
