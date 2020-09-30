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

// OFFPLAN FEATURES
const AsyncCoppiaSeguranca = Load({
    loader: () =>
        import(
            "./feature-pages/offplan-features/CoppiaSeguranca" /* webpackChunkName: "pro-feature-page-lazy" */
        ),
});

const AsyncSattisfacaoClientes = Load({
    loader: () =>
        import(
            "./feature-pages/offplan-features/SattisfacaoClientes" /* webpackChunkName: "pro-feature-page-lazy" */
        ),
});

const featureStore = (data) => ({
    OrgganizeClients_1: <AsyncOrgganizeClients />,
    EnvvioWhatsapp_2: <AsyncEnvvioWhatsapp />,
    CoppiaSeguranca: <AsyncCoppiaSeguranca data={data} />,
    SattisfacaoClientes: <AsyncSattisfacaoClientes data={data} />,
});

export default function pickFeature({
    category = "proFeature", // only used if there is the need for other categories to be managed...
    feature = "OrgganizeClients_1",
    options = {},
    data,
}) {
    const pickComp = () => {
        return featureStore(data)[feature];
    };

    return pickComp;
}
