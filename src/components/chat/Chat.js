// chat with history with light/dark mode options
// reference: https://codepen.io/tiantsoa/pen/RwpwoWY
// ref whatsapp chat (some further inspiration in features): https://codepen.io/swaibu/pen/QxJjwN
import HistoryList from "./history-list/HistoryList";
import ChatContent from "./chat-content/ChatContent";
import UserInfoCard from "./UserInfoCard";
import { Fragment } from "react";
import "./Chat.scss";

export default function Chat({ subject = "suggestion", role }) {
    return (
        <div class="home-page__content messages-page">
            <div class="container-fluid h-100">
                <div class="row px-0 h-100">
                    <HistoryList />
                    <ChatContent />
                    <UserInfoCard />
                </div>
            </div>
        </div>
    );
}

/* JS methonds
$chat = $(".chat");
$profile = $(".user-profile");

// Screen resize handler
const smallDevice = window.matchMedia("(max-width: 767px)");
const largeScreen = window.matchMedia("(max-width: 1199px)");
smallDevice.addEventListener("change", handleDeviceChange);
largeScreen.addEventListener("change", handleLargeScreenChange);

handleDeviceChange(smallDevice);
handleLargeScreenChange(largeScreen);

function handleDeviceChange(e) {
  if (e.matches) chatMobile();
  else chatDesktop();
}

function handleLargeScreenChange(e) {
  if (e.matches) profileToogleOnLarge();
  else profileExtraLarge();
}

function chatMobile() {
  $chat.addClass("chat--mobile");
}

function chatDesktop() {
  $chat.removeClass("chat--mobile");
}

function profileToogleOnLarge() {
  $profile.addClass("user-profile--large");
}

function profileExtraLarge() {
  $profile.removeClass("user-profile--large");
}

// Events
$(".messaging-member").click(function () {
  $chat.fadeIn();
  $chat.addClass("chat--show");
});

$(".chat__previous").click(function () {
  $chat.removeClass("chat--show");
});

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
