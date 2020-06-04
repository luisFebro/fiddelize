import LoadableVisible from '../../../code-splitting/LoadableVisible';

// need logospinner as loading...
const VAsyncDashAppDesign = LoadableVisible({
  loader: () => import("./DashAppDesign" /* webpackChunkName: "cli-admin-design-session-lazy" */),
});

export default VAsyncDashAppDesign;