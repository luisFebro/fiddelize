import LoadableComp from "../../components/code-splitting/LoadableComp";

const AsyncProgressMsg = LoadableComp({
    loader: () =>
        import(
            "./ProgressMsg" /* webpackChunkName: "progress-msg-comp-lazy" */
        ),
});

export default AsyncProgressMsg;
