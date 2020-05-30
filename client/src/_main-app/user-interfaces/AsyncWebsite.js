import React from 'react';
import LoadableComp from '../../components/code-splitting/LoadableComp';

const AsyncWebsite = LoadableComp({
  loader: () => import("./Website" /* webpackChunkName: "website-content-lazy" */),
});

export default AsyncWebsite;