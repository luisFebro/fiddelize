import React from 'react';
import LoadableVisible from '../../components/code-splitting/LoadableVisible';

const AsyncRegisterClientAdmin = LoadableVisible({
  loader: () => import("./RegisterClientAdmin" /* webpackChunkName: "cli-admin-register-comp-lazy" */),
});

export default AsyncRegisterClientAdmin;