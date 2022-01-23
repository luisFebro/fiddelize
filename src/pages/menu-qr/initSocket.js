import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ROOT_DOMAIN } from "api/root";
import showToast from "components/toasts";

export default function getInitSocket({ namespace }) {
    // every namespace should includes nsp before the actual name. e.g nspSupport
    const URL = `${ROOT_DOMAIN}/${namespace}`;
    const socket = io(URL, {
        autoConnect: false,
    });

    return socket;
}

export function useInitSocket({ namespace, role, roomId, adminId }) {
    // LESSON: always use useEffect to initialize methods like io(). It was bugging aorund with many requests and preventing using broadcast.imit to exclude the sender
    const [socketData, setSocketData] = useState(null);

    useEffect(() => {
        if (!adminId) return;
        const socket = getInitSocket({ namespace });

        startSocketSession(socket, {
            role,
            roomId,
            adminId,
        });
        startInitialListeners(socket);

        return setSocketData(socket);
        // eslint-disable-next-line
    }, [role, namespace, roomId, adminId]);

    return socketData;
}

export function startSocketSession(socket, data = {}) {
    const values = {
        roomId: data.roomId,
        role: data.role,
        adminId: data.adminId,
    };
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
