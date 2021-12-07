// chat with history with light/dark mode options
// reference: https://codepen.io/tiantsoa/pen/RwpwoWY
// ref whatsapp chat (some further inspiration in features): https://codepen.io/swaibu/pen/QxJjwN
import { useEffect, useState } from "react";
import useScrollUp from "hooks/scroll/useScrollUp";
import { Provider } from "context";
import getItems from "init/lStorage";
import { io } from "socket.io-client";
import useSupportWaveColor from "pages/support/useSupportWaveColor";
import useGlobal from "./useGlobal";
import HistoryChatList from "./history-list/HistoryChatList";
import UserInfoCard from "./UserInfoCard";
// import
import "./Chat.scss";
import "styles/bootstrap-layout-only-min.css";

const [chatDarkMode, chatBgColor] = getItems("global", [
    "chatDarkMode",
    "chatBgColor",
]);
const isSmall = window.Helper.isSmallScreen();

export default function Chat({ subject, chatUserId, name, role }) {
    const [darkMode, setDarkMode] = useState(chatDarkMode || false);

    useScrollUp();
    useSupportWaveColor(chatBgColor);

    const socketData = useStartSocketIo({ name, subject, chatUserId, role });

    useChatHandlers();

    // const msgList = [
    //     {
    //         msgId: "12332321ddsadsadssad",
    //         userId: "",
    //         unread: true,
    //         isFirstDayMsg: true,
    //         bubble: "other",
    //         msg: "Hello!",
    //         createdAt: "2021-12-02T12:38:18.366Z",
    //     },
    // ];

    // The list will be read as the most recent at the top to bottom
    const list = [
        {
            _id: "601df6b42be9a28986c2a821",
            otherUserName: "Renata Fernandis",
            otherUserRole: "cliente-membro",
            chatType: "pvtPair",
            roomId: null,
            dataType: {
                subject: "bugReport",
            },
            gotPendingMsg: false, // This will be verified when reading chat list
            status: "offline",
            avatar: "/img/logo-chat.png", // /img/logo-chat.png avatar for users will be initially their first letters with material-ui avatars
            dbMsgs: [],
        },
        {
            _id: "601df6b42be9adasdsa28986c2a821",
            otherUserName: "Luis Febro",
            otherUserRole: "cliente-admin",
            chatType: "pvtPair",
            roomId: null,
            dataType: {
                subject: "others",
            },
            gotPendingMsg: false, // This will be verified when reading chat list
            status: "offline",
            avatar: "/img/logo-chat.png", // /img/logo-chat.png avatar for users will be initially their first letters with material-ui avatars
            dbMsgs: [],
        },
        {
            _id: "601df6ab42be9adsadasdsa28986c2a821",
            otherUserName: "Ricardo Italo",
            otherUserRole: "cliente",
            chatType: "pvtPair",
            roomId: null,
            dataType: {
                subject: "suggestion",
            },
            gotPendingMsg: false, // This will be verified when reading chat list
            status: "offline",
            avatar: "/img/logo-chat.png", //  avatar for users will be initially their first letters with material-ui avatars
            dbMsgs: [],
        },
        {
            _id: "601df6ab42be9ads(((adasdsa28986c2a821",
            otherUserName: "Jéssica Lins",
            otherUserRole: "visitante",
            chatType: "pvtPair",
            roomId: null,
            dataType: {
                subject: "suggestion",
            },
            gotPendingMsg: false, // This will be verified when reading chat list
            status: "offline",
            avatar: "/img/logo-chat.png", //  avatar for users will be initially their first letters with material-ui avatars
            dbMsgs: [],
        },
    ];

    // sent by content field if the chat is support or other kind of chat
    const isSupport = true;
    const store = useGlobal({
        role,
        mainDataList: list || [],
        setDarkMode,
        isSupport,
        ...socketData,
    });

    return (
        <Provider store={store}>
            <section className="chat--root">
                <div
                    className={`${
                        darkMode ? "dark-mode" : ""
                    } home-page__content messages-page`}
                >
                    <div
                        className="container-fluid h-100"
                        style={{
                            scroll: "scrollable",
                        }}
                    >
                        <div className="row px-0 h-100 h-md-0">
                            <HistoryChatList />
                            <UserInfoCard />
                        </div>
                    </div>
                    <style jsx>
                        {`
                            .h-100 {
                                height: 100% !important;
                            }
                        `}
                    </style>
                </div>
            </section>
        </Provider>
    );
}

// HOOKS
function useStartSocketIo({ chatUserId, role = null, name = null, subject }) {
    // LESSON: always use useEffect to initialize methods like io(). It was bugging aorund with many requests and preventing using broadcast.imit to exclude the sender
    const [data, setData] = useState({
        socket: null,
        doneInit: false,
    });
    const { doneInit } = data;

    useEffect(() => {
        if (!chatUserId || doneInit) return;

        const device = isSmall ? "app" : "desktop";
        const host = undefined; // window.location is the default "http://yourdomain.com";
        const query = {
            userId: chatUserId,
            cliName: name,
            device,
            subject,
            role,
        };

        const thisSocket = io(host, {
            query,
            reconnection: false,
            // rejectUnauthorized: false,
            // transports: ['websocket'],  // https://stackoverflow.com/a/52180905/8987128
            // upgrade: false,
        });

        // the socket will not reconnect only in case of forcefully or manually disconnection
        // thisSocket.on("disconnect", () => {});

        setData((prev) => ({
            ...prev,
            socket: thisSocket,
            doneInit: true,
        }));
        // eslint-disable-next-line
    }, [chatUserId, doneInit]);

    return data;
}

function useChatHandlers() {
    useEffect(() => {
        if (!window) return;

        const chat = document.querySelector(".chat");
        const profile = document.querySelector(".user-profile");

        // Screen resize handler
        // for instance, change modal to fixed when in mobile and remove it when in large screen, etc
        const smallDevice = window.matchMedia("(max-width: 767px)");
        smallDevice.addEventListener("change", handleDeviceChange);
        const largeScreen = window.matchMedia("(max-width: 1199px)");

        largeScreen.addEventListener("change", handleLargeScreenChange);

        function handleDeviceChange(e) {
            function chatMobile() {
                if (chat) chat.classList.add("chat--mobile");
                if (profile) profile.classList.add("user-profile--mobile");
            }

            function chatDesktop() {
                if (chat) chat.classList.remove("chat--mobile");
                if (profile) profile.classList.remove("user-profile--mobile");
            }

            if (e.matches) chatMobile(chat);
            else chatDesktop(chat);
        }

        function handleLargeScreenChange(e) {
            function profileToogleOnLarge() {
                if (profile) profile.classList.add("user-profile--large");
            }

            function profileExtraLarge() {
                if (profile) profile.classList.remove("user-profile--large");
            }

            if (e.matches) profileToogleOnLarge(profile);
            else profileExtraLarge(profile);
        }

        handleDeviceChange(smallDevice);
        handleLargeScreenChange(largeScreen);
    }, []);
}
// END HOOKS

/* ARCHIVES

function handleLargeScreenChange(e) {
    function profileToogleOnLarge() {
        if (profile) profile.classList.add("user-profile--large");
    }

    function profileExtraLarge() {
        if (profile) profile.classList.remove("user-profile--large");
    }

    if (e.matches) profileToogleOnLarge(profile);
    else profileExtraLarge(profile);
}

*/
