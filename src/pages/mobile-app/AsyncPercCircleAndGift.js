import LoadableComp from "../../components/code-splitting/LoadableComp";

const AsyncPercCircleAndGift = LoadableComp({
    loader: () =>
        import(
            "./PercCircleAndGift" /* webpackChunkName: "perc-and-gift-comp-lazy" */
        ),
});

export default AsyncPercCircleAndGift;
