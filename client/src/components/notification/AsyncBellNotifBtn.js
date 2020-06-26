import React from 'react';
import LoadableComp from '../../components/code-splitting/LoadableComp';
import Spinner from '../../components/loadingIndicators/Spinner';

const AsyncBellNotifBtn = LoadableComp({ // n1
  loader: () => import("./BellNotifBtn" /* webpackChunkName: "bell-btn-comp-lazy" */),
  loading: () => <div style={{margin: '70px 0'}}><Spinner size="small" /></div>
});

export default AsyncBellNotifBtn;