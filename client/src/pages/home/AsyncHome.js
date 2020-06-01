import React from 'react';
import LoadableComp from '../../components/code-splitting/LoadableComp';

const AsyncHome = LoadableComp({
  loader: () => import("./Home" /* webpackChunkName: "home-page-lazy" */),
});

export default AsyncHome;