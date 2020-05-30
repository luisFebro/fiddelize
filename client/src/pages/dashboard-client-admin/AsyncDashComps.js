import React from "react";
import Loadable from "react-loadable";
import LoadableComp from '../../components/code-splitting/LoadableComp';
import FullPageLoading from '../../components/loadingIndicators/FullPageLoading';
// n1 -magic comments for two or more modules..
const AsyncDashClients = LoadableComp({
  loader: () => import("./DashComps" /* webpackChunkName: "cli-admin-dashboard-lazy" */).then(comp => comp.DashClients),
});

const AsyncDashAppDesign = LoadableComp({
  loader: () => import("./DashComps" /* webpackChunkName: "cli-admin-dashboard-lazy" */).then(comp => comp.DashAppDesign),
});

const AsyncDashSetting = LoadableComp({
  loader: () => import("./DashComps" /* webpackChunkName: "cli-admin-dashboard-lazy"*/).then(comp => comp.DashSetting),
  loading: FullPageLoading, // not working...
});

export {
  AsyncDashAppDesign,
  AsyncDashSetting,
  AsyncDashClients,
};


/* COMMENTS
n1:
You can make sure that two (2) or more dynamic imports get included in the same bundle by adding a nickname to a bundle and using the same nickname on the contents that you want to be grouped together
which would instruct webpack to create a single chunk (bundle) out of these two pages.

https://itnext.io/tips-tricks-for-smaller-bundles-in-react-apps-58d1b20c9c0
*/