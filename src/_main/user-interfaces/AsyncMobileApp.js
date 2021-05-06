import LoadableComp from "../../components/code-splitting/LoadableComp";

const AsyncMobileApp = LoadableComp({
    loader: () =>
        import(
            "./MobileApp" /* webpackChunkName: "mobile-app-full-content-lazy" */
        ),
});

export default AsyncMobileApp;
