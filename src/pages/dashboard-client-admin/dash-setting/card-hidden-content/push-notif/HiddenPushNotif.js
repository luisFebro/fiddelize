import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import showToast from "../../../../../components/toasts";
import SwitchBtn, {
    treatBoolStatus,
} from "../../../../../components/buttons/material-ui/SwitchBtn";
import useAPI, {
    readOrUpdateNotifStatus,
} from "../../../../../hooks/api/useAPI";
import getAPI from "../../../../../utils/promises/getAPI";
import useData from "../../../../../hooks/useData";
import subscribeUser from "../../../../../components/pwa-push-notification/subscription";

export default function HiddenPushNotif() {
    const [data, setData] = useState({
        isDesktopOn: null,
        isMobileOn: null,
    });
    const { isDesktopOn, isMobileOn } = data;

    const [role, userId] = useData(["role", "userId"]);

    const body = {
        role,
        userId,
    };

    const { data: dataPush, loading } = useAPI({
        method: "put",
        url: readOrUpdateNotifStatus("read"),
        body,
        trigger: userId !== "...",
    });

    const handleStatusUpdate = async (status, target) => {
        const isActive = status === true;
        if (isActive) {
            await subscribeUser({ role, userId });
        }

        await getAPI({
            method: "put",
            url: readOrUpdateNotifStatus("update"),
            body: {
                ...body,
                desktopOn: target === "isDesktopOn" ? status : isDesktopOn,
                mobileOn: target === "isMobileOn" ? status : isMobileOn,
            },
            trigger: userId !== "...",
        });

        showToast(
            `Notificações ${isActive ? "ativadas" : "desativadas"} ${
                target === "isDesktopOn"
                    ? "para apps desktop"
                    : "para apps mobile"
            }!`,
            { type: "success" }
        );
    };

    useEffect(() => {
        if (dataPush) {
            setData({
                isMobileOn: dataPush.mobileOn,
                isDesktopOn: dataPush.desktopOn,
            });
        }
    }, [dataPush]);

    const handleSwitch = async (status, target) => {
        await setData({
            ...data,
            [`${target}`]: treatBoolStatus(status),
        });
        await handleStatusUpdate(treatBoolStatus(status), target);
    };

    const showSwitchBtn = (target) => (
        <SwitchBtn
            titleQuestion="Ativar?"
            titleLeft="Não"
            titleRight="Sim"
            callback={(status) => handleSwitch(status, target)}
            defaultStatus={target === "isMobileOn" ? isMobileOn : isDesktopOn}
        />
    );

    const mobileRender =
        isMobileOn === null ? (
            <p className="text-normal text-center text-grey">(Desativado)</p>
        ) : (
            showSwitchBtn("isMobileOn")
        );
    const desktopRender =
        isDesktopOn === null ? (
            <p className="text-normal text-center text-grey">(Desativado)</p>
        ) : (
            showSwitchBtn("isDesktopOn")
        );
    return (
        <section className="hidden-content--root text-normal mt-4">
            <h2 className="text-subtitle font-weight-bold text-center">
                Suas preferências de Notificações
            </h2>
            <section className="my-3">
                <div className="text-center">Em apps mobile:</div>
                {loading ? (
                    <p className="text-subtitle text-center text-grey">...</p>
                ) : (
                    mobileRender
                )}
                <div className="text-center mt-4">Em apps desktop:</div>
                {loading ? (
                    <p className="text-subtitle text-center text-grey">...</p>
                ) : (
                    desktopRender
                )}
            </section>
            <div className="text-grey text-small font-weight-bold">
                <h2 className="text-subtitle text-center">Notas:</h2>
                <p>
                    1) Desativando as notificações, você entende que não será
                    notificado quando:
                </p>
                - Um cliente ganhar um desafio;
                <br />
                - Relatório de compras dos clientes;
                <br />
                - Status de investimentos;
                <br />- Novidadades e atualizações sobre os apps do seu negócio
                ou da plataforma Fiddelize.
                <p className="my-3">
                    2) Pode cadastrar até 2 dispositivos em formatos diferentes.
                    Por exemplo, você pode usar no seu computador e celular e
                    receber notificações nos dois.
                </p>
                <p>
                    3) Para cada formato de dispositivo, só é possível ter um
                    dispositivo ativo. Por exemplo, se você ativou as
                    notificações no formato mobile, em dois celulares
                    diferentes, o primeiro é desativado e o último é ativado.
                </p>
            </div>
        </section>
    );
}
