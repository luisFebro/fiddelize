import LoadableComp from '../../../components/code-splitting/LoadableComp';

const AsyncLoyaltyScoreHandler = LoadableComp({
  loader: () => import("./LoyaltyScoreHandler" /* webpackChunkName: "loyalty-score-session-lazy" */),
});

export default AsyncLoyaltyScoreHandler;

