import React, { useState } from "react";
import ButtonFab from "../../../../../../../components/buttons/material-ui/ButtonFab";
import ModalYesNo from "../../../../../../../components/modals/ModalYesNo";
import useAPI, {
    cancelSMS,
    getUniqueId,
} from "../../../../../../../hooks/api/useAPI";
import { useAppSystem } from "../../../../../../../hooks/useRoleData";

export default function CancelBtn({ cardId, date }) {
    const [fullOpen, setFullOpen] = useState(false);
    const [trigger, setTrigger] = useState(false);

    const { businessId: userId } = useAppSystem();

    const uniqueId = getUniqueId();
    const runName = `UpdateSMSAll ${uniqueId}`;
    const runName2 = `ForceCancelScheduled ${cardId}`;
    const snackbar = {
        txtPending: "Cancelando agendamento...",
        txtSuccess: "Cancelado! Atualizando...",
    };

    const { data, loading, setRun, dispatch } = useAPI({
        method: "put",
        url: cancelSMS(userId, cardId),
        needAuth: true,
        trigger,
        runName,
        snackbar,
        callback: () => {
            setFullOpen(false);
            setRun(dispatch, runName, { runName2 });
        },
    });

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const handleConfirmCancel = () => {
        setTrigger(true);
    };

    return (
        <section>
            <ButtonFab
                size="small"
                position="relative"
                title="Cancelar"
                onClick={handleFullOpen}
                backgroundColor="var(--expenseRed)"
                variant="extended"
            />
            <ModalYesNo
                title="Você confirma o<br />cancelamento do envio?"
                subTitle={`Esse agendamento está<br />marcado para o <strong>dia ${date}</strong>`}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                actionFunc={handleConfirmCancel}
            />
        </section>
    );
}
