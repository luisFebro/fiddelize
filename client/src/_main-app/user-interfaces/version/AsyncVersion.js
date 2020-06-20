import React from 'react';
import LoadableComp from '../../../components/code-splitting/LoadableComp';

const AsyncVersion = LoadableComp({ // n1
  loader: () => import("./Version" /* webpackChunkName: "software-version-lazy" */),
  loading: () => <div className="text-white text-shadow text-normal font-weight-bold text-center">Carregando...</div>
});

export default AsyncVersion;

/* ARCHIVES
const AsyncAppVersion = LoadableComp({
    loader: () => import('./AppVersion' /* webpackChunkName: "app-version-lazy" ),
    loading: () => <div className="text-white text-shadow text-small">Carregando...</div>
})

*/