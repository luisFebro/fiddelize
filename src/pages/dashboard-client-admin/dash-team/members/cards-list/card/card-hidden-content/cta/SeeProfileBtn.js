import { useState } from "react";
import { useReadUser } from "api/frequent";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";

const Async = Load({
    loader: () =>
        import(
            "../../../../../../dash-clients/clients-history/card-hidden-content/modal-content-pages/ClientProfile" /* webpackChunkName: "member-profile-full-page-lazy" */
        ),
});

export default function SeeProfileBtn({ modalData = {} }) {
    const [fullOpen, setFullOpen] = useState(false);

    const { name, _id } = modalData;

    const select = "name createdAt email";
    const { data: payload, loading } = useReadUser(
        _id,
        "cliente-membro",
        select,
        { trigger: fullOpen }
    );

    const data = {
        name: loading ? "..." : payload.name,
        cpf: loading ? "..." : payload.cpf,
        createdAt: loading ? "..." : payload.createdAt,
        email: loading ? "..." : payload.email,
    };
    const AsyncMemberProfile = (
        <Async
            data={data}
            title={"&#187; Perfil do Membro"}
            subtitle={
                <p>
                    <span className="font-weight-bold text-normal">
                        • NOME:
                    </span>
                    <br />
                    {name || "Não informado"},
                </p>
            }
        />
    );

    const onOpen = () => {
        setFullOpen(true);
    };

    return (
        <section>
            <ButtonFab
                position="relative"
                size="large"
                title="Ver Perfil"
                onClick={onOpen}
                backgroundColor="var(--themeSDark--default)"
                variant="extended"
            />
            <ModalFullContent
                contentComp={AsyncMemberProfile}
                fullOpen={fullOpen}
                setFullOpen={setFullOpen}
            />
        </section>
    );
}
