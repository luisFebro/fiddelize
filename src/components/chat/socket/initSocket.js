import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { CLIENT_URL } from "config/clientUrl";
import getItems, { setItems } from "init/lStorage";
import showToast from "components/toasts";

export default function getInitSocket({ auth, query, namespace }) {
    // every namespace should includes nsp before the actual name. e.g nspSupport
    const URL = namespace ? `${CLIENT_URL}/${namespace}` : CLIENT_URL;
    const socket = io(URL, {
        // url/root from frontend like localhost:3000 window.location is the default "http://yourdomain.com";
        auth,
        query,
        autoConnect: false,
        // rejectUnauthorized: false, // default
        // reconnection: false,
        // transports: ['websocket'],  // https://stackoverflow.com/a/52180905/8987128
        // upgrade: false,
    });

    return socket;
}

export function useInitSocket({ namespace, userId, setData, userName, role }) {
    // LESSON: always use useEffect to initialize methods like io(). It was bugging aorund with many requests and preventing using broadcast.imit to exclude the sender
    const [socketData, setSocketData] = useState(null);

    useEffect(() => {
        // first time, the roomId is created in the backend and fetch back to the frontend
        // userId and userName only if the user is loggedIn. If it is a visitor, this userName is attached to the socket when user click in the continue button
        const auth = { roomId: undefined, userName, userId, role };

        const socket = getInitSocket({ namespace, auth });

        retrieveDataOnReload(socket, { setData, role, userName });
        startInitialListeners(socket, { setData, role, userName });

        return setSocketData(socket);
        // eslint-disable-next-line
    }, [userId, role, userName]);

    return socketData;
}

// after user reloads the page, fetch the previously added ids directly from the localstorage
function retrieveDataOnReload(socket, options = {}) {
    const { setData, role, userName } = options;

    const [chatRoomId, chatUserId, chatUserName] = getItems("global", [
        "chatRoomId",
        "chatUserId",
        "chatUserName",
    ]);

    if (chatRoomId) {
        socket.auth = {
            roomId: chatRoomId,
            userId: chatUserId,
            userName: chatUserName || userName,
            role,
        };

        setData((prev) => ({
            ...prev,
            chatUserId,
            chatRoomId,
        }));
    }

    return true;
}

function startInitialListeners(socket, options = {}) {
    const { setData, role, userName } = options;
    //  register a catch-all listener, any event received by the client will be printed in the console.
    socket.onAny((event, ...args) => {
        console.log(event, args);
    });

    socket.on("session", (d) => {
        const [chatRoomId, chatUserId, chatUserName] = getItems("global", [
            "chatRoomId",
            "chatUserId",
            "chatUserName",
        ]);

        // in order to make sure the roomId and userId is consistent and possible changes in the backend, try find the previously added ids in the localstorage before get from the server
        const ultimateRoomId = chatRoomId || d.roomId;
        const ultimateUserId = chatUserId || d.userId;
        const ultimateUserName = chatUserName || d.userName;

        // set ids to the localstorage if they are new
        if (!chatRoomId) {
            setItems("global", {
                chatRoomId: ultimateRoomId, // only requires this, but chatUserId is used to keep consistency especially in requests
                chatUserId: ultimateUserId,
                chatUserName: ultimateUserName,
            });
        }

        setData((prev) => ({
            ...prev,
            chatRoomId: ultimateRoomId,
            chatUserId: ultimateUserId,
            // userName is set in the support page
        }));

        // attach the session ID to the next reconnection attempts
        socket.auth = {
            roomId: ultimateRoomId,
            userId: ultimateUserId,
            userName: ultimateUserName || userName,
            role,
        };
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
