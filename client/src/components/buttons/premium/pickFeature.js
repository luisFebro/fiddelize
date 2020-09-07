import React from "react";
import { Load } from "../../../components/code-splitting/LoadableComp";

const AsyncOrgganizeClients = Load({
    loader: () =>
        import(
            "./feature-pages/OrgganizeClients_1" /* webpackChunkName: "pro-feature-page-lazy" */
        ),
});
const AsyncEnvvioWhatsapp = Load({
    loader: () =>
        import(
            "./feature-pages/EnvvioWhatsapp_2" /* webpackChunkName: "pro-feature-page-lazy" */
        ),
});

const featureStore = {
    OrgganizeClients_1: <AsyncOrgganizeClients />,
    EnvvioWhatsapp_2: <AsyncEnvvioWhatsapp />,
};

export default function pickFeature({
    category = "proFeature", // only used if there is the need for other categories to be managed...
    feature = "FilterOrgganizeClients_func1",
    options = {},
}) {
    const pickComp = () => {
        return featureStore[feature];
    };

    return pickComp;
}
