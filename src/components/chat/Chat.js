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

const [chatDarkMode] = getItems("global", ["chatDarkMode"]);

export default function Chat({ subject = "suggestion", role }) {
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
            msgs: ["Obrigado, filho da puta!!!", "Bye!!!"],
            createdAt: new Date(),
        },
    ];

    const list = [
        {
            _id: "231313211211",
            otherUserName: "Fiddelize",
            status: "online",
            avatar: "/img/logo.png",
            lastMsg:
                "Yes, I need your help with the project, it need it done by tomorrow 😫",
            msgList,
        },
    ];

    const store = useGlobal({
        subject,
        role,
        mainDataList: list || [],
        setDarkMode,
    });

    return (
        <Provider store={store}>
            <div
                className={`chat--root ${
                    darkMode ? "dark-mode" : ""
                } home-page__content messages-page`}
            >
                <div className="container h-100">
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
