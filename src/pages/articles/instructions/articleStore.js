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

// FEATURES
const AsyncOrgganizeClientsFilter = Load({
    loader: () =>
        import(
            "./OrgganizeClientsFilter.js" /* webpackChunkName: "instru-article-page-lazy" */
        ),
});
// END FEATURES

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

const AsyncExpiringCoinsDeadline = Load({
    loader: () =>
        import(
            "./ExpiringCoinsDeadline" /* webpackChunkName: "instru-article-page-lazy" */
        ),
});

const articleStore = {
    ExpiringCoinsDeadline: <AsyncExpiringCoinsDeadline />,
    DiscountBack: <AsyncDiscountBack />,
    TargetPrize: <AsyncChallengeModes />,
    OrgganizeClientsFilter: <AsyncOrgganizeClientsFilter />,
    ScoreDiscount_art3: <AsyncScoreDiscount />,
    WhySMS_art4: <AsyncWhySMS />,
};

export default articleStore;
