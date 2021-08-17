import { Load } from "components/code-splitting/LoadableComp";

export const AsyncShoppingGamesPanel = Load({
    loader: () =>
        import(
            "pages/new-app/shopping-games-panel/ShoppingGamesPanel.js" /* webpackChunkName: "shopping-games-panel-page-lazy" */
        ),
});

export const AsyncBizInfo = Load({
    loader: () =>
        import(
            "pages/new-app/biz-info/BizInfo" /* webpackChunkName: "biz-info-page-lazy" */
        ),
});

export const AsyncSelfService = Load({
    loader: () =>
        import(
            "pages/new-app/self-service/SelfServicePage" /* webpackChunkName: "new-app-self-service-page-lazy" */
        ),
});

export const AsyncAdminRegister = Load({
    loader: () =>
        import(
            "pages/new-app/admin-register/AdminRegister" /* webpackChunkName: "admin-register-page-lazy" */
        ),
});
