import LoadableComp from "../../components/code-splitting/LoadableComp";

const AsyncDownloadApp = LoadableComp({
    loader: () =>
        import(
            "./DownloadApp" /* webpackChunkName: "download-app-page-lazy" */
        ),
});

export default AsyncDownloadApp;
