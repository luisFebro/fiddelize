// chat with history with light/dark mode options
// reference: https://codepen.io/tiantsoa/pen/RwpwoWY
// ref whatsapp chat (some further inspiration in features): https://codepen.io/swaibu/pen/QxJjwN
import { useEffect, useState } from "react";
import { Provider } from "context";
import getItems from "init/lStorage";
import useGlobal from "./useGlobal";
import HistoryList from "./history-list/HistoryList";
import ChatContent from "./chat-content/ChatContent";
import UserInfoCard from "./UserInfoCard";
import "./Chat.scss";
import "styles/references/bootstrap4.ref.css";

// LoadableVisible({
//     loader: () =>
//         import("styles/references/bootstrap4.ref.css" /* webpackChunkName: "full-bootstrap-lazy" */),
// })

const [chatDarkMode] = getItems("global", ["chatDarkMode"]);

export default function Chat({ subject, role }) {
    useChatHandlers();
    const [darkMode, setDarkMode] = useState(chatDarkMode || false);

    // request the client list of chats here

    const msgList = [
        {
            _id: "1233ff2321",
            isFirstDayMsg: true,
            bubble: "me",
            msgs: [
                "Hey, I bought something yesterdat but haven't gotten any confirmation. Do you know I if the order went through?",
                "Hi! I just checked, cool, your order went through and is on it's way home. Enjoy your new computer! 😃",
            ],
            createdAt: new Date(),
        },
        {
            _id: "123323fsdfds21",
            isFirstDayMsg: false,
            bubble: "other",
            msgs: [
                "Ohh thanks ! I was really worried about it !",
                "Can't wait for it to be delivered",
            ],
            createdAt: new Date(),
        },
        {
            _id: "1233232fds1",
            isFirstDayMsg: true,
            bubble: "me",
            msgs: [
                "Aenean iaculis massa non lorem dignissim volutpat. Praesent id faucibus lorem, a sagittis nunc. Duis facilisis lectus vel sapien ultricies, sed placerat augue elementum. In sagittis, justo nec sodales posuere, nunc est sagittis tellus, eget scelerisque dolor risus vel augue",
                "Is everything alright?",
            ],
            createdAt: new Date(),
        },
        {
            _id: "12332321fdsf",
            isFirstDayMsg: false,
            bubble: "other",
            msgs: [
                "Vestibulum finibus pulvinar quam, at tempus lorem. Pellentesque justo sapien, pulvinar sed magna et, vulputate commodo nisl. Aenean pharetra ornare turpis. Pellentesque viverra blandit ullamcorper. Mauris tincidunt ac lacus vel convallis. Vestibulum id nunc nec urna accumsan dapibus quis ullamcorper massa. Aliquam erat volutpat. Nam mollis mi et arcu dapibus condimentum.",
                "Nulla facilisi. Duis laoreet dignissim lectus vel maximus",
                "Curabitur volutpat, ipsum a condimentum hendrerit ! 😊",
            ],
            createdAt: new Date(),
        },
        {
            _id: "12332321",
            isFirstDayMsg: true,
            bubble: "me",
            msgs: ["Obrigado", "Bye!!!"],
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
            otherUserName:
                "Vocariza Languages Mohter fucker fsfdsfd fds fds fsd",
            subject: "usageHelp",
            newMsg: false,
            status: "offline",
            avatar: "/img/test/vocariza.png",
            msgList: [
                {
                    _id: "12332321",
                    isFirstDayMsg: true,
                    bubble: "other",
                    msgs: ["Não esqueça de passar lá no nosso website!"],
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
                    <div className="container-fluid h-100">
                        <div className="row px-0 h-100">
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
function useChatHandlers() {
    useEffect(() => {
        if (!window) return;

        const chat = document.querySelector(".chat");
        const profile = document.querySelector(".user-profile");

        // Screen resize handler
        const smallDevice = window.matchMedia("(max-width: 767px)");
        const largeScreen = window.matchMedia("(max-width: 1199px)");
        smallDevice.addEventListener("change", handleDeviceChange);
        largeScreen.addEventListener("change", handleLargeScreenChange);

        function handleDeviceChange(e) {
            function chatMobile() {
                if (chat) chat.classList.add("chat--mobile");
            }

            function chatDesktop() {
                if (chat) chat.classList.remove("chat--mobile");
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

/* JS methonds


// Events
$(".chat__details").click(function () {
  $profile.fadeIn();
  $profile.addClass("user-profile--show");
});

$(".user-profile__close").click(function () {
  $profile.removeClass("user-profile--show");
});

$(".messages-page__dark-mode-toogler").click(function () {
  $("body").toggleClass("dark-mode");
});

*/
