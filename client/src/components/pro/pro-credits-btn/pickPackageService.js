import React from "react";
import { Load } from "../../../components/code-splitting/LoadableComp";

const AsyncNovvosClientes = Load({
    loader: () =>
        import(
            "../../../pages/plans-page/plan-modes/sessions/customer-packages/customer-btn/AsyncAddCustomersContent" /* webpackChunkName: "package-service-page-lazy" */
        ),
});

const packageServiceStore = (data) => ({
    "Novvos Clientes": <AsyncNovvosClientes modalData={data} />,
});

export default function pickPackageService({
    service = "Novvos Clientes",
    data,
}) {
    const pickComp = () => {
        return packageServiceStore(data)[service];
    };

    return pickComp;
}
