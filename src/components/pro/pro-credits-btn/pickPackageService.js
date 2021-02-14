import { Load } from "../../code-splitting/LoadableComp";

const AsyncNovvosClientes = Load({
    loader: () =>
        import(
            "../../../pages/plans-page/plan-modes/sessions/customer-packages/customer-btn/AsyncAddCustomersContent" /* webpackChunkName: "pro-package-service-page-lazy" */
        ),
});

const AsyncNovvosMembros = Load({
    loader: () =>
        import(
            "../../../pages/plans-page/plan-modes/sessions/member-packages/member-btn/AsyncAddMembersContent" /* webpackChunkName: "pro-package-service-page-lazy" */
        ),
});

const packageServiceStore = (data) => ({
    "Novvos Clientes": <AsyncNovvosClientes modalData={data} />,
    "Novvos Membros": <AsyncNovvosMembros modalData={data} />,
});

export default function pickPackageService({
    service = "Novvos Clientes",
    data,
}) {
    const pickComp = () => packageServiceStore(data)[service];

    return pickComp;
}
