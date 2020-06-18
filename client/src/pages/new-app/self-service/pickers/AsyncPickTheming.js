import React from 'react';
import LoadableComp from '../../../../components/code-splitting/LoadableComp';
import CompLoader from '../../../../components/CompLoader';

const AsyncComp = LoadableComp({ // n1
  loader: () => import("./PickTheming" /* webpackChunkName: "pick-theming-comp-lazy" */),
});
console.log("AsyncComp", AsyncComp);

const AsyncPickTheming = AsyncComp; //<CompLoader comp={AsyncComp} marginY={50} />

export default AsyncPickTheming;