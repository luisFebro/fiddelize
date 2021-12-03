// chat with history with light/dark mode options
// reference: https://codepen.io/tiantsoa/pen/RwpwoWY
// ref whatsapp chat (some further inspiration in features): https://codepen.io/swaibu/pen/QxJjwN
import { useEffect, useState } from "react";
import { Provider } from "context";
import getItems from "init/lStorage";
import { io } from "socket.io-client";
import useGlobal from "./useGlobal";
import HistoryList from "./history-list/HistoryList";
import ChatContent from "./chat-content/ChatContent";
import UserInfoCard from "./UserInfoCard";
import "./Chat.scss";
import "styles/bootstrap-layout-only-min.css";

// LoadableVisible({
//     loader: () =>
//         import("styles/references/bootstrap4.ref.css" /* webpackChunkName: "full-bootstrap-lazy" */),
// })

const [chatDarkMode] = getItems("global", ["chatDarkMode"]);

export default function Chat({ subject, role }) {
    const [darkMode, setDarkMode] = useState(chatDarkMode || false);
    useStartSocketIo();
    useChatHandlers();

    // request the client list of chats here

    const msgList = [
        {
            _id: "1233ff2321",
            isFirstDayMsg: true,
            bubble: "me",
            msgs: [
                {
                    m:
                        "Hey, I bought something yesterdat but haven't gotten any confirmation. Do you know I if the order went through?",
                    t: "2021-12-02T12:38:18.366Z",
                },
                {
                    m:
                        "Hi! I just checked, cool, your order went through and is on it's way home. Enjoy your new computer! 😃",
                    t: "2021-12-02T12:38:18.366Z",
                },
            ],
            createdAt: new Date(),
        },
        {
            _id: "123323fsdfds21",
            isFirstDayMsg: false,
            bubble: "other",
            msgs: [
                {
                    m: "Ohh thanks ! I was really worried about it !",
                    t: "2021-12-02T12:38:18.366Z",
                },
                {
                    m: "Can't wait for it to be delivered",
                    t: "2021-12-02T12:38:18.366Z",
                },
            ],
            createdAt: new Date(),
        },
        {
            _id: "1233232fds1",
            isFirstDayMsg: true,
            bubble: "me",
            msgs: [
                {
                    m:
                        "Aenean iaculis massa non lorem dignissim volutpat. Praesent id faucibus lorem, a sagittis nunc. Duis facilisis lectus vel sapien ultricies, sed placerat augue elementum. In sagittis, justo nec sodales posuere, nunc est sagittis tellus, eget scelerisque dolor risus vel augue",
                    t: "2021-12-02T12:38:18.366Z",
                },
                { m: "Is everything alright?", t: "2021-12-02T12:38:18.366Z" },
            ],
            createdAt: new Date(),
        },
        {
            _id: "12332321fdsf",
            isFirstDayMsg: false,
            bubble: "other",
            msgs: [
                {
                    m:
                        "Vestibulum finibus pulvinar quam, at tempus lorem. Pellentesque justo sapien, pulvinar sed magna et, vulputate commodo nisl. Aenean pharetra ornare turpis. Pellentesque viverra blandit ullamcorper. Mauris tincidunt ac lacus vel convallis. Vestibulum id nunc nec urna accumsan dapibus quis ullamcorper massa. Aliquam erat volutpat. Nam mollis mi et arcu dapibus condimentum.",
                    t: "2021-12-02T12:38:18.366Z",
                },
                {
                    m:
                        "Nulla facilisi. Duis laoreet dignissim lectus vel maximus",
                    t: "2021-12-02T12:38:18.366Z",
                },
                {
                    m: "Curabitur volutpat, ipsum a condimentum hendrerit ! 😊",
                    t: "2021-12-02T12:38:18.366Z",
                },
            ],
            createdAt: new Date(),
        },
        {
            _id: "12332321",
            isFirstDayMsg: true,
            bubble: "me",
            msgs: [
                { m: "Obrigado", t: "2021-12-02T12:38:18.366Z" },
                { m: "Bye!!!", t: "2021-12-02T20:38:18.366Z" },
            ],
            createdAt: new Date(),
        },
    ];

    // The list will be read as the most recent at the top to bottom
    const list = [
        {
            _id: "231313211211",
            otherUserName: "Fiddelize",
            subject: "bugReport",
            newMsg: true,
            status: "online",
            avatar: "/img/logo-chat.png",
            msgList,
        },
        {
            _id: "23131321121dadsa1",
            meName: "Febro",
            otherUserName: "Luis Febro",
            subject: "usageHelp",
            newMsg: false,
            status: "offline",
            avatar: "/img/test/vocariza.png",
            msgList: [
                {
                    _id: "12332321",
                    isFirstDayMsg: true,
                    bubble: "other",
                    msgs: [
                        {
                            m: "Não esqueça de passar lá no nosso website!",
                            t: "2021-12-02T12:38:18.366Z",
                        },
                    ],
                    createdAt: new Date(),
                },
            ],
        },
    ];

    // sent by content field if the chat is support or other kind of chat
    const isSupport = true;
    const store = useGlobal({
        role,
        mainDataList: list || [],
        setDarkMode,
        isSupport,
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
                            <ChatContent />
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
function useStartSocketIo() {
    useEffect(() => {
        const socket = io();
        socket.on("connect", () => {
            console.log("socket.id", socket.id);
        });
    }, []);
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
