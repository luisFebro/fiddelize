import { Load } from "../../../components/code-splitting/LoadableComp";

const AsyncDiscountBack = Load({
    loader: () =>
        import(
            "./DiscountBack" /* webpackChunkName: "instru-article-page-lazy" */
        ),
});

const AsyncChallengeModes = Load({
    loader: () =>
        import(
            "./ChallengeModes_art2" /* webpackChunkName: "instru-article-page-lazy" */
        ),
});
const AsyncScoreDiscount = Load({
    loader: () =>
        import(
            "./ScoreDiscount_art3" /* webpackChunkName: "instru-article-page-lazy" */
        ),
});
const AsyncWhySMS = Load({
    loader: () =>
        import(
            "./WhySMS_art4" /* webpackChunkName: "instru-article-page-lazy" */
        ),
});

const articleStore = {
    DiscountBack: <AsyncDiscountBack />,
    TargetPrize: <AsyncChallengeModes />,
    ScoreDiscount_art3: <AsyncScoreDiscount />,
    WhySMS_art4: <AsyncWhySMS />,
};

export default articleStore;
