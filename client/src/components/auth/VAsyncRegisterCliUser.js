import React from 'react';
import LoadableVisible from '../../components/code-splitting/LoadableVisible';

// need logospinner as loading...
const VAsyncRegisterCliUser = LoadableVisible({
  loader: () => import("./Register" /* webpackChunkName: "cli-user-register-comp-lazy" */),
});

export default VAsyncRegisterCliUser;