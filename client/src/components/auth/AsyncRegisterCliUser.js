import LoadableComp from '../code-splitting/LoadableComp';

// need logospinner as loading...
const AsyncRegisterCliUser = LoadableComp({
  loader: () => import("./Register" /* webpackChunkName: "cli-user-register-comp-lazy" */),
});

export default AsyncRegisterCliUser;