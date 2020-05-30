import React from 'react';
import LoadableComp from '../../components/code-splitting/LoadableComp';

const AsyncMobileApp = LoadableComp({
  loader: () => import("./MobileApp" /* webpackChunkName: "mobile-app-content-lazy" */),
});

export default AsyncMobileApp;