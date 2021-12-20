import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ROOT_DOMAIN } from "api/root";
import getItems, { setItems } from "init/lStorage";
import showToast from "components/toasts";

export default function getInitSocket({ namespace }) {
    // every namespace should includes nsp before the actual name. e.g nspSupport
    const URL = `${ROOT_DOMAIN}/${namespace}`;
    const socket = io(URL, {
        autoConnect: false,
    });

    return socket;
}

export function useInitSocket({ namespace, role, userId, name }) {
    // LESSON: always use useEffect to initialize methods like io(). It was bugging aorund with many requests and preventing using broadcast.imit to exclude the sender
    const [socketData, setSocketData] = useState(null);

    useEffect(() => {
        const socket = getInitSocket({ namespace });

        startSocketSession(socket, {
            role,
            userId,
            name,
        });
        startInitialListeners(socket);

        return setSocketData(socket);
        // eslint-disable-next-line
    }, [role, userId, name, namespace]);

    return socketData;
}

// save locally and socket - used both in every reconnection and starting right after click on continue button to enter in the support page
export function startSocketSession(socket, data = {}) {
    const [chatRoomId, chatUserId, chatUserName, chatRoom] = getItems(
        "global",
        ["chatRoomId", "chatUserId", "chatUserName", "chatRoom"]
    );

    let values = {
        chatRoomId: data.chatRoomId || chatRoomId, // only requires this, but chatUserId is used to keep consistency especially in requests
        chatUserId: data.chatUserId || chatUserId,
        chatUserName: data.chatUserName || chatUserName,
        chatRole: data.chatRole || chatRoom,
    };

    if (data.role === "nucleo-equipe") {
        values = {
            chatRoomId: "cgOdhq7Jzfuh9hujfMX0", // only requires this, but chatUserId is used to keep consistency especially in requests
            chatRole: "nucleo-equipe",
            chatUserId: data.userId,
            chatUserName: data.name,
        };
    }

    setItems("global", values);
    socket.auth = values;
}

function startInitialListeners(socket) {
    socket.onAny((event, ...args) => {
        console.log(event, args);
    });

    socket.on("connect_error", (err) => {
        console.log("socket connect_err", err);
        if (err.message === "missing required data") {
            showToast("ocorreu um erro ao conectar com socket.io");
        }

        if (err.message === "xhr post error") {
            // removeItems("global", ["chatRoomId", "chatUserId"])
        }
    });
}
