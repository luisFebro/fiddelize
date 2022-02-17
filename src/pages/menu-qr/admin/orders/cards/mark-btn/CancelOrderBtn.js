import { useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalYesNo from "components/modals/ModalYesNo";
import showToast from "components/toasts";

export default function CancelOrderBtn({ closeOrderModal, cancelData }) {
    const { socket, adminId, placeId, customerId } = cancelData;
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const handleCancelOrder = () => {
        if (!socket) return console.log("No socket!");

        const socketData = {
            adminId,
            placeId,
            customerId,
            "order.stage": "canceled",
        };

        // const emailCond = Boolean(
        //     select === "preparing" || select === "done"
        // );

        const isOnline = placeId && placeId.includes("online");
        const notifData = {
            needEmail: false,
        };
        // const notifData = {
        //     url: isOnline
        //         ? `/${bizLinkName}/menu?cliId=${customerId}`
        //         : `/${bizLinkName}/menu/${placeId}?cliId=${customerId}`,
        //     bizLogo,
        //     needEmail: false,//emailCond,
        // };
        if (isOnline) socket.emit("joinRoom", placeId);
        socket.emit("updateCustomerOrder", socketData, notifData);

        socket.emit("updateAdminList");
        showToast("Pedido cancelado e movido para feito", {
            dur: 3000,
            type: "success",
        });
        closeOrderModal();
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
                title="Confirmado o<br />cancelamento do pedido atual?"
                subTitle={null}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                actionFunc={handleCancelOrder}
            />
        </section>
    );
}
