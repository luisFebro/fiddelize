// chat with history with light/dark mode options
// reference: https://codepen.io/tiantsoa/pen/RwpwoWY
// ref whatsapp chat (some further inspiration in features): https://codepen.io/swaibu/pen/QxJjwN
import { useEffect, useState } from "react";
import useScrollUp from "hooks/scroll/useScrollUp";
import { Provider } from "context";
import getItems from "init/lStorage";
import { io } from "socket.io-client";
import useData from "init";
import useGlobal from "./useGlobal";
import HistoryList from "./history-list/HistoryList";
import ChatContent from "./chat-content/ChatContent";
import UserInfoCard from "./UserInfoCard";
import "./Chat.scss";
import "styles/bootstrap-layout-only-min.css";

const [chatDarkMode] = getItems("global", ["chatDarkMode"]);

export default function Chat({ subject }) {
    const [darkMode, setDarkMode] = useState(chatDarkMode || false);

    useScrollUp();

    const { userId, name, agentJob, role } = useData();
    const isDev = agentJob === "dev";

    const socketData = useStartSocketIo({ isDev, name, subject, userId, role });

    useChatHandlers();

    const msgList = [
        {
            msgId: "12332321ddsadsadssad",
            userId: "",
            isFirstDayMsg: true,
            bubble: "other",
            msg: "Hello!",
            createdAt: "2021-12-02T12:38:18.366Z",
        },
        {
            msgId: "12332321dsad",
            userId: "",
            isFirstDayMsg: false,
            bubble: "me",
            msg: "Buy!",
            createdAt: "2021-12-02T12:38:18.366Z",
        },
    ];

    // The list will be read as the most recent at the top to bottom
    const list = [
        {
            _id: "231313211211",
            otherUserName: "Fiddelize",
            chatType: "pvtPair",
            support: {
                subject: "bugReport",
            },
            gotPendingMsg: true,
            status: "online",
            avatar: "/img/logo-chat.png",
            dbMsgs: msgList,
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
                            <HistoryList />
                            <ChatContent userId={userId} />
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
function useStartSocketIo({
    userId = "123",
    role = null,
    name,
    subject = "compliment",
    isDev,
}) {
    // LESSON: always use useEffect to initialize methods like io(). It was bugging aorund with many requests and preventing using broadcast.imit to exclude the sender
    const [data, setData] = useState({
        socket: null,
        userSocketId: null,
    });

    useEffect(() => {
        const thisSocketIo = io(undefined, {
            query: `cliName=${name}&subject=${subject}&userId=${userId}&role=${role}&isDev=${isDev}`,
        });

        // every time a socket is connected or reconnected, a new socketId is generated both here and in the server to identify the current user session. This is great to identify and update status
        thisSocketIo.on("connect", () => {
            setData({
                socket: thisSocketIo,
                // if some issue with reloading occurs, consider save the socketId separately in the localstorage
                userSocketId: thisSocketIo.id,
            });
        });

        // the socket will not reconnect only in case of forcefully or manually disconnection
        thisSocketIo.on("disconnect", () => {});
    }, [isDev, name, subject, userId, role]);

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
