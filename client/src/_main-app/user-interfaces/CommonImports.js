import React from "react";
import { Load } from "../../components/code-splitting/LoadableComp";
import AccessPassword from "../../pages/access-password/AccessPassword";
// All component pages which are using both in website and mobile app goes here in next updates...

// PASSWORDS
export { AccessPassword };
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
