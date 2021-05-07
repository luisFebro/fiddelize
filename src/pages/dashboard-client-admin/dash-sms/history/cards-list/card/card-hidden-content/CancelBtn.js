import { useState } from "react";
import { useBizData } from "init";
import useAPI, { cancelSMS, getUniqueId } from "api/useAPI";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalYesNo from "components/modals/ModalYesNo";

export default function CancelBtn({ cardId, date }) {
    const [fullOpen, setFullOpen] = useState(false);
    const [trigger, setTrigger] = useState(false);

    const { bizId: userId } = useBizData();

    const uniqueId = getUniqueId();
    const runName = `UpdateSMSAll ${uniqueId}`;
    const runName2 = `ForceCancelScheduled ${cardId}`;
    const snackbar = {
        txtPending: "Cancelando agendamento...",
        txtSuccess: "Cancelado! Atualizando...",
    };

    const { data, loading, setRun, uify } = useAPI({
        method: "put",
        url: cancelSMS(userId, cardId),
        needAuth: true,
        trigger,
        runName,
        snackbar,
        callback: () => {
            setFullOpen(false);
            setRun("runName", runName, uify);
            setRun("runName2", runName2, uify);
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
