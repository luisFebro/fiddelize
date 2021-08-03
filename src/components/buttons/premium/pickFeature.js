// import { Load } from "../../code-splitting/LoadableComp";

const featureStore = (data) => ({
    OrgganizeClients_1: null, // <AsyncOrgganizeClients data={data} />
});

export default function pickFeature({
    feature = "OrgganizeClients_1",
    data,
    // category = "proFeature", // only used if there is the need for other categories to be managed...
    // options = {},
}) {
    const pickComp = () => featureStore(data)[feature];

    return pickComp;
}

// ARCHIVES
// const AsyncOrgganizeClients = Load({
//     loader: () =>
//         import(
//             "./feature-pages/OrgganizeClients_1" /* webpackChunkName: "pro-feature-page-lazy"
//         ),
// });
