import React from 'react';
import LoadableComp from '../../components/code-splitting/LoadableComp';

const AsyncLoginPage = LoadableComp({
  loader: () => import("./LoginPage" /* webpackChunkName: "auth-login-page-lazy" */),
});

export default AsyncLoginPage;