import React from 'react';
import LoadableComp from '../../components/code-splitting/LoadableComp';
import Spinner from '../../components/loadingIndicators/Spinner';

const AsyncBellNotifBtn = LoadableComp({ // n1
  loader: () => import("./BellNotifBtn" /* webpackChunkName: "bell-btn-comp-lazy" */),
  loading: () => <div className="my-4"><Spinner size="large"/></div>
});

export default AsyncBellNotifBtn;