// right after init socket, attach these main socket listeners
import { useEffect } from "react";
import getItems, { setItems, removeItems } from "init/lStorage";

export default function useUpdateChatList(socket, data = {}) {
    const { role, updateChatList } = data;

    useEffect(() => {
        if (!socket) return;

        socket.on("updateSupport", (options = {}) => {
            const { finishSubject = false, roomId } = options;
            updateChatList();
            // chatRoomId should be deleted every time a subject is closed so that a new roomId is generated next time and avoid duplicates
            // chatRoomId should not be removed.
            if (finishSubject) {
                removePendingFieldMsg(roomId);

                if (role !== "nucleo-equipe") {
                    setTimeout(() => {
                        removeItems("global", [
                            "chatPreventMainPanel",
                            "chatRoomId",
                        ]);
                        socket.disconnect();
                    }, 2000);
                }
            }
        });
    }, [socket, role]);
}

// HELPERS
function removePendingFieldMsg(roomId) {
    // remove any pending msg from user after closing a subject
    const [chatTempLastFieldMsgs] = getItems("global", [
        "chatTempLastFieldMsgs",
    ]);
    if (!chatTempLastFieldMsgs) return null;

    const tempObj = chatTempLastFieldMsgs;
    delete tempObj[roomId];

    return setItems("global", {
        chatTempLastFieldMsgs: tempObj,
    });
}
// END HELPERS
