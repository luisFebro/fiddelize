import LoadableComp from '../../components/code-splitting/LoadableComp';

const AsyncPasswordPage = LoadableComp({
  loader: () => import("./PasswordPage" /* webpackChunkName: "password-page-lazy" */),
});

export default AsyncPasswordPage;