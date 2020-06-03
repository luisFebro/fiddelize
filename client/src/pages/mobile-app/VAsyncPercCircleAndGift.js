import LoadableVisible from '../../components/code-splitting/LoadableVisible';

const VAsyncPercCircleAndGift = LoadableVisible({
  loader: () => import("./PercCircleAndGift" /* webpackChunkName: "perc-and-gift-comp-lazy" */),
});

export default VAsyncPercCircleAndGift;