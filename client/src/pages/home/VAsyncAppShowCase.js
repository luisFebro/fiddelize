import LoadableVisible from '../../components/code-splitting/LoadableVisible';

const VAsyncAppShowCase = LoadableVisible({
  loader: () => import("./AppShowCase" /* webpackChunkName: "app-show-case-comp-lazy" */),
});

export default VAsyncAppShowCase;