import React, { useState } from "react";
import ButtonFab from "../../../../../../../../components/buttons/material-ui/ButtonFab";
import ModalConfYesNo from "../../../../../../../../components/modals/ModalYesNo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ModalBtn({ modalData }) {
    const [fullOpen, setFullOpen] = useState(false);

    const { name } = modalData;

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
                size="small"
                title="excluir"
                iconFontAwesome={<FontAwesomeIcon icon="trash-alt" />}
                backgroundColor="var(--expenseRed)"
                onClick={onOpen}
                variant="extended"
            />
            <ModalConfYesNo
                title={`Confirmação<br />de Exclusão de Membro`}
                subTitle={`Lembrando que o crédito usado não é reutilizado. Confirmado a exclusão de:<br /><strong>${name}</strong> ?`}
                setFullOpen={setFullOpen}
                fullOpen={fullOpen}
            />
        </section>
    );
}
