import React from 'react';
import LoadableVisible from '../../components/code-splitting/LoadableVisible';

const AsyncRegisterCliUser = LoadableVisible({
  loader: () => import("./Register" /* webpackChunkName: "cli-user-register-comp-lazy" */),
});

export default AsyncRegisterCliUser;