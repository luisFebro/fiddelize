import LoadableComp from "../../components/code-splitting/LoadableComp";

const AsyncMoreOptionsBtn = LoadableComp({
    loader: () =>
        import(
            "./MoreOptionsBtn" /* webpackChunkName: "more-options-btn-comp-lazy" */
        ),
});

export default AsyncMoreOptionsBtn;
