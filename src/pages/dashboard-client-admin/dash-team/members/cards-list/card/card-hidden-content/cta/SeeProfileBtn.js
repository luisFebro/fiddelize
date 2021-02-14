import { useState } from "react";
import ButtonFab from "../../../../../../../../components/buttons/material-ui/ButtonFab";
import ModalFullContent from "../../../../../../../../components/modals/ModalFullContent";
import { Load } from "../../../../../../../../components/code-splitting/LoadableComp";
import useAPI, { readUser } from "../../../../../../../../hooks/api/useAPI";

const Async = Load({
    loader: () =>
        import(
            "../../../../../../dash-clients/clients-history/card-hidden-content/modal-content-pages/ClientProfile" /* webpackChunkName: "member-profile-full-page-lazy" */
        ),
});

export default function ModalBtn({ modalData = {} }) {
    const [fullOpen, setFullOpen] = useState(false);

    const { name, _id } = modalData;

    const params = {
        select: "-_id name cpf createdAt phone email birthday",
    };

    const { data: payload, loading } = useAPI({
        url: readUser(_id, "cliente-membro"),
        params,
    });

    const data = {
        name: loading ? "..." : payload.name,
        cpf: loading ? "..." : payload.cpf,
        createdAt: loading ? "..." : payload.createdAt,
        phone: loading ? "..." : payload.phone,
        email: loading ? "..." : payload.email,
        birthday: loading ? "..." : payload.birthday,
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
                    {name},
                </p>
            }
        />
    );

    const onOpen = () => {
        setFullOpen(true);
    };

    const onClose = () => {
        setFullOpen(false);
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
