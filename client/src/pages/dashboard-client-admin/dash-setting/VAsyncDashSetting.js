import React from 'react';
import LoadableVisible from '../../../components/code-splitting/LoadableVisible';
import FullPageLoading from '../../../components/loadingIndicators/FullPageLoading';
// import { IS_DEV } from '../../../config/clientUrl';

const VAsyncDashSetting = LoadableVisible({
  loader: () => import("./DashSetting" /* webpackChunkName: "cli-admin-setting-session-lazy" */),
  loading: () => true ? null : <FullPageLoading />,
});

export default VAsyncDashSetting;