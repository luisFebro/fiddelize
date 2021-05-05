import { useState } from "react";
import SwitchBtn from "components/buttons/material-ui/SwitchBtn";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import useAPI, { getUniqueId, removeTaskAndExpireCliPrize } from "api/useAPI";

export default function ActionBtn({
    type = "pendingDelivery",
    callback,
    defaultStatus = false,
    taskId,
    expired = false,
    dataExpired,
}) {
    if (type === "pendingDelivery") {
        const selectedCardType = () => {
            if (expired)
                return (
                    <ShowExpiredCardFunc
                        dataExpired={dataExpired}
                        taskId={taskId}
                    />
                );

            return (
                <SwitchBtn
                    leftTitle="Não"
                    rightTitle="Sim"
                    titleQuestion="Entregue?"
                    callback={callback}
                    defaultStatus={defaultStatus}
                />
            );
        };

        const expiredCss = expired ? "expired" : "";
        return (
            <section className={`action-btn-pending-delivery ${expiredCss}`}>
                {selectedCardType()}
            </section>
        );
    }
}

const defaultBody = {
    adminId: "123",
    taskId: "123",
    cliUserId: "123",
    prizeId: "123",
};
function ShowExpiredCardFunc({ dataExpired = defaultBody, taskId }) {
    const [trigger, setTrigger] = useState(false);

    const snackbar = {
        txtPending:
            "Apagando tarefa e marcando prêmio do cliente como expirado...",
        timePending: 6000,
        txtSuccess: "Tarefa apagada e prêmio expirado!",
    };

    useAPI({
        method: "put",
        url: removeTaskAndExpireCliPrize(),
        body: dataExpired,
        trigger,
        snackbar,
        runName: `TaskCard${taskId}`,
    });

    const handleExpiredRequest = () => {
        const randomId = getUniqueId();
        setTrigger(randomId);
    };

    return (
        <section className="task-card--expired-msg">
            <div className="msg-board">
                <p className="text-normal m-0 mx-2">Expirou</p>
            </div>
            <div>
                <ButtonFab
                    position="relative"
                    backgroundColor="var(--mainDark)"
                    variant="extended"
                    title="apagar"
                    iconMarginLeft=" "
                    onClick={handleExpiredRequest}
                />
            </div>
        </section>
    );
}
