import LoadableComp from '../../components/code-splitting/LoadableComp';

const AsyncAppSharer = LoadableComp({
  loader: () => import("./AppSharer" /* webpackChunkName: "app-sharer-page-lazy" */),
});

export default AsyncAppSharer;