import { Load } from "../../../components/code-splitting/LoadableComp";

const AsyncGiftVisibility = Load({
    loader: () =>
        import(
            "./GiftVisibility_art1" /* webpackChunkName: "instru-article-page-lazy" */
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

export const articleStore = {
    GiftVisibility_art1: <AsyncGiftVisibility />,
    ChallengeModes_art2: <AsyncChallengeModes />,
    ScoreDiscount_art3: <AsyncScoreDiscount />,
    WhySMS_art4: <AsyncWhySMS />,
};
