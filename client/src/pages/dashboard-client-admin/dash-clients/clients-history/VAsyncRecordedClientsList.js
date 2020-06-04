import LoadableVisible from '../../../../components/code-splitting/LoadableVisible';

const VAsyncRecordedClientsList = LoadableVisible({
  loader: () => import("./RecordedClientsList" /* webpackChunkName: "app-recorded-clients-list-comp-lazy" */),
});

export default VAsyncRecordedClientsList;