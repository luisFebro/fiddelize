import React from 'react';
import LoadableVisible from '../../components/code-splitting/LoadableVisible';

// need logospinner as loading...
const VAsyncRegisterClientAdmin = LoadableVisible({
  loader: () => import("./RegisterClientAdmin" /* webpackChunkName: "cli-admin-register-comp-lazy" */),
});

export default VAsyncRegisterClientAdmin;