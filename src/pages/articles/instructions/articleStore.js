import { Load } from "../../../components/code-splitting/LoadableComp";

// BUY GAMES
const AsyncScoreDiscount = Load({
    loader: () =>
        import(
            "./ScoreDiscount_art3" /* webpackChunkName: "instru-article-page-lazy" */
        ),
});

const AsyncDiscountBack = Load({
    loader: () =>
        import(
            "./DiscountBack" /* webpackChunkName: "instru-article-page-lazy" */
        ),
});
// END BUY GAMES

const AsyncChallengeModes = Load({
    loader: () =>
        import(
            "./ChallengeModes_art2" /* webpackChunkName: "instru-article-page-lazy" */
        ),
});

const AsyncWhySMS = Load({
    loader: () =>
        import(
            "./WhySMS_art4" /* webpackChunkName: "instru-article-page-lazy" */
        ),
});

// FEATURES
const AsyncOrgganizeClientsFilter = Load({
    loader: () =>
        import(
            "./OrgganizeClientsFilter.js" /* webpackChunkName: "instru-article-page-lazy" */
        ),
});
// END FEATURES

const articleStore = {
    DiscountBack: <AsyncDiscountBack />,
    TargetPrize: <AsyncChallengeModes />,
    OrgganizeClientsFilter: <AsyncOrgganizeClientsFilter />,
    ScoreDiscount_art3: <AsyncScoreDiscount />,
    WhySMS_art4: <AsyncWhySMS />,
};

export default articleStore;
