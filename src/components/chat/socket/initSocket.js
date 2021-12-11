import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { CLIENT_URL } from "config/clientUrl";
import getItems, { setItems } from "init/lStorage";
// import showToast from "components/toasts";

export default function getInitSocket({
    auth,
    query,
    autoConnect = false,
    namespace,
}) {
    // every namespace should includes nsp before the actual name. e.g nspSupport
    const URL = namespace ? `${CLIENT_URL}/${namespace}` : CLIENT_URL;
    const socket = io(URL, {
        // url/root from frontend like localhost:3000 window.location is the default "http://yourdomain.com";
        auth,
        query,
        // autoConnect: false,
        // rejectUnauthorized: false, // default
        // reconnection: false,
        // transports: ['websocket'],  // https://stackoverflow.com/a/52180905/8987128
        // upgrade: false,
    });

    return socket;
}

export function useInitSocket({ namespace, userId, role, autoConnect = true }) {
    // LESSON: always use useEffect to initialize methods like io(). It was bugging aorund with many requests and preventing using broadcast.imit to exclude the sender
    const [data, setData] = useState({
        socket: null,
        doneInit: false,
        chatUserId: null,
        chatRoomId: null,
        blockNewSupport: false, // if the ids are being retrieved from localstorage
    });
    const { doneInit } = data;

    useEffect(() => {
        if (doneInit) return null;

        const auth = { roomId: undefined, userId };
        const query = { role };

        const socket = getInitSocket({ namespace, autoConnect, auth, query });
        socket.userId = userId;

        const [
            chatRoomId,
            chatUserId,
            chatPreventMainPanel,
        ] = getItems("global", [
            "chatRoomId",
            "chatUserId",
            "chatPreventMainPanel",
        ]);
        if (chatRoomId) {
            // this.usernameAlreadySelected = true;
            socket.auth = { roomId: chatRoomId, userId }; // lesson: values inserted here need to be valid, otherwise will throw errors
            socket.query = { role };
            socket.userId = chatUserId;

            setData((prev) => ({
                ...prev,
                chatUserId,
                chatRoomId,
                // if user has previous stored data, but has no pending attendance, allow s/he to take another one. chatPrentMainPanel is only true while there is one pending and going attendance
                blockNewSupport: chatPreventMainPanel,
            }));
        }

        // connect right away
        if (autoConnect) socket.connect();

        //  register a catch-all listener, any event received by the client will be printed in the console.
        socket.onAny((event, ...args) => {
            console.log(event, args);
        });

        // LESSON: create ramdom Id in the backend and attach it and start socket before anything to be saved, otherwise - saving in the frontend - will cause the id to be different
        socket.on("session", (d) => {
            setItems("global", {
                chatRoomId: d.roomId, // only requires this, but chatUserId is used to keep consistency especially in requests
                chatUserId: d.userId,
            });

            // attach the session ID to the next reconnection attempts
            socket.auth = { roomId: d.roomId, userId };
            socket.query = { role };
            socket.userId = d.userId;
            // store it in the localStorage

            setData((prev) => ({
                ...prev,
                chatUserId: d.userId,
                chatRoomId: d.roomId,
            }));
        });

        socket.on("connect_error", (err) => {
            console.log("socket connect_err", err);
            if (err.message === "missing required data") {
                console.log("ocorreu um erro ao conectar com socket.io");
            }

            if (err.message === "xhr post error") {
                // removeItems("global", ["chatRoomId", "chatUserId"])
            }
        });

        return setData((prev) => ({
            ...prev,
            socket,
            doneInit: true,
        }));
        // eslint-disable-next-line
    }, [userId, role, doneInit]);

    return {
        socket: data.socket,
        chatUserId: data.chatUserId,
        chatRoomId: data.chatRoomId,
        blockNewSupport: data.blockNewSupport,
    };
}
