// right after init socket, attach these main socket listeners
import { useEffect } from "react";
import { removeItems } from "init/lStorage";

export default function useUpdateChatList(socket, data = {}) {
    const { role, updateChatList } = data;

    useEffect(() => {
        if (!socket) return;

        socket.on(
            "emitSupport",
            ({ joinRoomOnly = false, roomId, finishSubject = false }) => {
                if (role === "nucleo-equipe" && joinRoomOnly) {
                    return socket.emit("joinRoom", { roomId, role });
                }

                updateChatList();
                if (finishSubject)
                    removeItems("global", ["chatPreventMainPanel"]);
            }
        );
    }, [socket, role]);
}
