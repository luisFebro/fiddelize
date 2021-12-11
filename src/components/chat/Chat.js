// chat with history with light/dark mode options
// reference: https://codepen.io/tiantsoa/pen/RwpwoWY
// ref whatsapp chat (some further inspiration in features): https://codepen.io/swaibu/pen/QxJjwN
import { useEffect, useState } from "react";
import useScrollUp from "hooks/scroll/useScrollUp";
import { Provider } from "context";
import getItems, { removeItems } from "init/lStorage";
import useSupportWaveColor from "pages/support/useSupportWaveColor";
import useAPIList, { readSupportHistory } from "api/useAPIList";
import useRun, { setRun, useAction } from "global-data/ui";
import getId from "utils/getId";
import RadiusBtn from "components/buttons/RadiusBtn";
import useUpdateChatList from "./socket/socketListeners";
import useGlobal from "./useGlobal";
import HistoryChatList from "./history-list/HistoryChatList";
import UserInfoCard from "./UserInfoCard";
// import
import "./Chat.scss";
import "styles/bootstrap-layout-only-min.css";

const [chatDarkMode] = getItems("global", ["chatDarkMode"]);
// const isSmall = window.Helper.isSmallScreen();

// list inspired by DoneBenefitsList. (in case of future autocomplete feature implementation)

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

export default function Chat({ socket, chatUserId, role }) {
    const [darkMode, setDarkMode] = useState(chatDarkMode || false);
    const [skip, setSkip] = useState(0);
    const [search, setSearch] = useState("");

    const params = {
        chatUserId,
        role,
        search,
    };

    // UPDATE
    const { runName } = useRun(); // for update list from other comps
    const uify = useAction();
    useEffect(() => {
        if (runName && runName.includes("ChatSupportList")) {
            setSkip(0);
            setSearch("");
            setRun("runName", null, uify);
        }
    }, [runName, search]);
    // update list else where
    const updateChatList = async () => {
        // need diff id to trigger multiple times
        const newId = getId();
        setRun("runName", `ChatSupportList${newId}`, uify);
    };

    const data = {
        role,
        updateChatList,
    };

    useUpdateChatList(socket, data);
    // END UPDATE

    const dataChatList = useAPIList({
        url: readSupportHistory(),
        skip,
        params,
        listName: "ChatSupportList",
        limit: 10,
        needAuth: false,
        trigger: chatUserId && (search || runName || true), // search shoulb be the first, otherwise it will not trigger if other static value is in front.
    });

    // HOOKS
    useScrollUp();
    useSupportWaveColor();

    useChatHandlers();
    // END HOOKS

    // sent by content field if the chat is support or other kind of chat
    const isSupport = true;
    const needStatus = false;
    const store = useGlobal({
        role,
        setDarkMode,
        isSupport,
        updateChatList,
        setSkip,
        setSearch,
        chatUserId,
        dataChatList,
        needStatus,
        socket,
    });

    const showReturnAppBtn = () => (
        <div className="chat-return-app-btn position-absolute">
            <RadiusBtn
                zIndex={1}
                position="relative"
                width={150}
                backgroundColor="var(--themePLight)"
                title="Retornar app"
                top={-5}
                left={140}
                size="small"
                fontSize="15px"
                onClick={() => {
                    removeItems("global", ["chatPreventMainPanel"]);
                    window.location.href = "/app";
                }}
            />
            <style jsx>
                {`
                    .chat-return-app-btn {
                        pointer-events: event;
                    }
                `}
            </style>
        </div>
    );

    return (
        <Provider store={store}>
            {showReturnAppBtn()}
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
