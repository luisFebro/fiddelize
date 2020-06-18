import React from 'react';
import LoadableComp from '../../../../components/code-splitting/LoadableComp';
import CompLoader from '../../../../components/CompLoader';

const AsyncComp = LoadableComp({ // n1
  loader: () => import("./PickRatingIcon" /* webpackChunkName: "pick-rating-icon-comp-lazy" */),
});
console.log("AsyncComp", AsyncComp);

const AsyncPickRatingIcon = AsyncComp; //<CompLoader comp={AsyncComp} marginY={50} />

export default AsyncPickRatingIcon;