//LoadableVisibility will be depracated in favor ofintersectionobserver hooks
//e.g needRun && AsyncRegister
import LoadableComp from '../../components/code-splitting/LoadableComp';

// need logospinner as loading...
const VAsyncRegisterClientAdmin = LoadableComp({
  loader: () => import("./RegisterClientAdmin" /* webpackChunkName: "cli-admin-register-comp-lazy" */),
});

export default VAsyncRegisterClientAdmin;