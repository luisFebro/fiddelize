import LoadableComp from '../../../../../../components/code-splitting/LoadableComp';

const AsyncPurchaseHistory = LoadableComp({
  loader: () => import("./PurchaseHistory" /* webpackChunkName: "cli-purchase-history-full-page-lazy" */),
});

export default AsyncPurchaseHistory;