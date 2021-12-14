// right after init socket, attach these main socket listeners
import { useEffect } from "react";
import { removeItems } from "init/lStorage";

export default function useUpdateChatList(socket, data = {}) {
    const { role, updateChatList } = data;

    useEffect(() => {
        if (!socket) return;

        socket.on("updateSupport", (options = {}) => {
            const { finishSubject = false } = options;
            updateChatList();
            // chatRoomId should be deleted every time a subject is closed so that a new roomId is generated next time and avoid duplicates
            // chatRoomId should not be removed.
            if (finishSubject && role !== "nucleo-equipe")
                removeItems("global", ["chatPreventMainPanel", "chatRoomId"]);
        });

        // socket.on("joinCustomerRoom", roomId => {
        //     socket.emit("joinRoom", roomId);
        // });
    }, [socket, role]);
}
