import { Load } from "../../code-splitting/LoadableComp";

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
const AsyncPremmiosClientes = Load({
    loader: () =>
        import(
            "./feature-pages/PremmiosClientes_pro" /* webpackChunkName: "pro-feature-page-lazy" */
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
    OrgganizeClients_1: <AsyncOrgganizeClients data={data} />,
    EnvvioWhatsapp_2: <AsyncEnvvioWhatsapp data={data} />,
    PremmiosClientes_pro: <AsyncPremmiosClientes data={data} />,
    // offplan features
    CoppiaSeguranca: <AsyncCoppiaSeguranca data={data} />,
    SattisfacaoClientes: <AsyncSattisfacaoClientes data={data} />,
});

export default function pickFeature({
    category = "proFeature", // only used if there is the need for other categories to be managed...
    feature = "OrgganizeClients_1",
    options = {},
    data,
}) {
    const pickComp = () => featureStore(data)[feature];

    return pickComp;
}
