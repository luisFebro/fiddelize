import LoadableVisible from '../../../../../../components/code-splitting/LoadableVisible';

// need logospinner as loading...
const VAsyncPurchaseHistory = LoadableVisible({
  loader: () => import("./PurchaseHistory" /* webpackChunkName: "cli-purchase-history-full-page-lazy" */),
});

export default VAsyncPurchaseHistory;