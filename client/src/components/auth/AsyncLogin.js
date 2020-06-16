import LoadableComp from '../code-splitting/LoadableComp';

const AsyncLogin = LoadableComp({
  loader: () => import("./Login" /* webpackChunkName: "login-comp-lazy" */),
});

export default AsyncLogin;