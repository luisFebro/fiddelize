import React from 'react';
import LoadableComp from '../../components/code-splitting/LoadableComp';
import Spinner from '../../components/loadingIndicators/Spinner';

const AsyncBellNotifBtn = LoadableComp({ // n1
  loader: () => import("./BellNotifBtn" /* webpackChunkName: "bell-btn-comp-lazy" */),
  loading: () => <Spinner marginY={100} width={150} height={150} size="small" />
});

export default AsyncBellNotifBtn;