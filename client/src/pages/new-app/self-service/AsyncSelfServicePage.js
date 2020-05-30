import React from 'react';
import LoadableComp from '../../../components/code-splitting/LoadableComp';

const AsyncSelfServicePage = LoadableComp({
  loader: () => import("./SelfServicePage" /* webpackChunkName: "self-service-page-lazy" */),
});

export default AsyncSelfServicePage;