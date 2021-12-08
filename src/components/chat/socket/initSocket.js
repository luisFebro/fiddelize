import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { CLIENT_URL } from "config/clientUrl";
import showToast from "components/toasts";

export default function getInitSocket({ query, namespace }) {
    // every namespace should includes nsp before the actual name. e.g nspSupport
    const URL = namespace ? `${CLIENT_URL}/${namespace}` : CLIENT_URL;
    const socket = io(URL, {
        // url/root from frontend like localhost:3000 window.location is the default "http://yourdomain.com";
        query,
        // rejectUnauthorized: false, // default
        // reconnection: false,
        // autoConnect: false,
        // transports: ['websocket'],  // https://stackoverflow.com/a/52180905/8987128
        // upgrade: false,
    });

    return socket;
}

export function useInitSocket({ namespace, userId, roomId, role }) {
    // LESSON: always use useEffect to initialize methods like io(). It was bugging aorund with many requests and preventing using broadcast.imit to exclude the sender
    const [data, setData] = useState({
        socket: null,
        doneInit: false,
    });
    const { doneInit } = data;

    useEffect(() => {
        if (!userId || doneInit) return;

        const query = { userId, roomId, role };

        const socket = getInitSocket({ namespace, query });
        // start socket right away here
        socket.connect();

        //  register a catch-all listener, any event received by the client will be printed in the console.
        socket.onAny((event, ...args) => {
            console.log(event, args);
        });

        // from SUPPORT middleware
        socket.on("connect_error", (err) => {
            if (err.message === "missing required data") {
                showToast("ocorreu um erro ao conectar no suporte", {
                    type: "error",
                });
            }
        });

        // the socket will not reconnect only in case of forcefully or manually disconnection
        // socket.on("disconnect", () => {});

        setData((prev) => ({
            ...prev,
            socket,
            doneInit: true,
        }));
        // eslint-disable-next-line
    }, [userId, roomId, role, doneInit]);

    return data;
}
