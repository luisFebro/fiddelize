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
