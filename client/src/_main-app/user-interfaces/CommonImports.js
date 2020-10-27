import React from "react";
import { Load } from "../../components/code-splitting/LoadableComp";
// COMMON PAGES
import AccessPassword from "../../pages/access-password/AccessPassword";
// END COMMON PAGES
// All component pages which are using both in website and mobile app goes here in next updates...

export { AccessPassword };

export const AsyncRecoverPassword = Load({
    loader: () =>
        import(
            "../../pages/access-password/NewPassword" /* webpackChunkName: "pass-recover-page-lazy" */
        ),
});

export const AsyncFixDatePage = Load({
    loader: () =>
        import(
            "../../pages/AsyncFixDatePage" /* webpackChunkName: "fix-date-page-lazy" */
        ),
});
