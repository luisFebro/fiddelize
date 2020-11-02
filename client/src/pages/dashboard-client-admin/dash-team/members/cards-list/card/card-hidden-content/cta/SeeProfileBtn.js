import React, { useState } from "react";
import ButtonFab from "../../../../../../../../components/buttons/material-ui/ButtonFab";
import ModalConfYesNo from "../../../../../../../../components/modals/ModalYesNo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalFullContent from "../../../../../../../../components/modals/ModalFullContent";
import { Load } from "../../../../../../../../components/code-splitting/LoadableComp";

const Async = Load({
    loader: () =>
        import(
            "../../../../../../dash-clients/clients-history/card-hidden-content/modal-content-pages/ClientProfile" /* webpackChunkName: "member-profile-full-page-lazy" */
        ),
});

export default function ModalBtn({ modalData = {} }) {
    const [fullOpen, setFullOpen] = useState(false);

    const { name = "Luis Febro" } = modalData;

    const data = {
        name: "Luis Febro",
        cpf: "023.248.892-42",
        createdAt: new Date(),
        phone: "(92) 99281-7363",
        email: "mr.febro@gmail.com",
        birthday: "23 de agosto de 1994",
    };
    const AsyncMemberProfile = (
        <Async
            data={data}
            title={`&#187; Perfil do Membro`}
            subtitle={
                <p>
                    <span className="font-weight-bold text-normal">
                        • NOME:
                    </span>
                    <br />
                    {name && name.cap()},
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
                backgroundColor={"var(--themeSDark--default)"}
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
