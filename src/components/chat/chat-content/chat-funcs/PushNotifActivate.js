import { useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import requestPermission, {
    isAlreadyAllowed,
} from "components/pwa-push-notification/pushNotifPermission";
import showToast from "components/toasts";

export default function PushNotifActivate({
    userId,
    role,
    saveNewMsg,
    msgList,
}) {
    const [backDrop, setBackDrop] = useState(false);

    const handlePermission = async (status = false) => {
        const alreadyDone =
            msgList.length &&
            msgList.some(
                (m) =>
                    m.content.msg &&
                    m.content.msg.includes("EMAIL principal") &&
                    m.from === "Fidda Bot"
            );
        if (alreadyDone)
            return showToast("Você já selecionou uma opção de notificação.");

        const deniedMsg =
            "Ok, nenhuma notificação será enviada.\n\nPor favor, digite agora seu EMAIL principal para retorno:";
        if (status === false) return saveNewMsg(deniedMsg);

        if (isAlreadyAllowed) {
            showToast(
                "seu dispositivo já está cadastrado para receber notificações.",
                { type: "success" }
            );
            return saveNewMsg("Por favor, agora digite seu EMAIL principal:");
        }

        setBackDrop(true);
        const permissionData = {
            setBackDrop,
            userId,
            role,
        };

        const permissionStatus = await requestPermission(permissionData).catch(
            () => {
                showToast("Um erro ocorreu ao ativar notificação", {
                    type: "error",
                });
                saveNewMsg("Por favor, agora digite seu EMAIL principal:");
            }
        );
        if (!permissionData) return null;

        let msg =
            "Ótimo. Vamos te enviar notificação para seu dispositivo. Mas é fato que algumas marcas não recebem notificações.\n\nPontanto, digite seu EMAIL principal como alternativa:";
        if (permissionStatus === "denied") msg = deniedMsg;

        return saveNewMsg(msg);
    };

    return (
        <section
            className={`${
                backDrop ? "backdrop-medium" : ""
            } ml-3 container-center`}
        >
            <ButtonFab
                title="não"
                marginLeft=" "
                backgroundColor="var(--mainRed)"
                onClick={() => setTimeout(() => handlePermission(false), 2500)}
                position="relative"
                variant="extended"
                size="small"
            />
            <div className="ml-3">
                <ButtonFab
                    title="sim"
                    marginLeft=" "
                    backgroundColor="var(--incomeGreen)"
                    onClick={() =>
                        setTimeout(() => handlePermission(true), 2000)
                    }
                    position="relative"
                    variant="extended"
                    size="small"
                />
            </div>
        </section>
    );
}
