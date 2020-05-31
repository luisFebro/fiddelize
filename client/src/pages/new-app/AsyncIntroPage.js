import React from 'react';
import LoadableComp from '../../components/code-splitting/LoadableComp';

const AsyncNewAppIntroPage = LoadableComp({
  loader: () => import("./IntroPage" /* webpackChunkName: "new-app-intro-page-lazy" */),
});

export default AsyncNewAppIntroPage;