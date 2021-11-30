import { Fragment } from "react";

export default function UpperArea() {
    return (
        <div class="chat__messaging messaging-member--online pb-2 pb-md-2 pl-2 pl-md-4 pr-2">
            <div class="chat__previous d-flex d-md-none">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="svg-icon svg-icon--previous"
                    viewBox="0 0 45.5 30.4"
                >
                    <path
                        d="M43.5,13.1H7l9.7-9.6A2.1,2.1,0,1,0,13.8.6L.9,13.5h0L.3,14v.6c0,.1-.1.1-.1.2v.4a2,2,0,0,0,.6,1.5l.3.3L13.8,29.8a2.1,2.1,0,1,0,2.9-2.9L7,17.2H43.5a2,2,0,0,0,2-2A2.1,2.1,0,0,0,43.5,13.1Z"
                        fill="#f68b3c"
                    />
                </svg>
            </div>
            <BadgeNewChat />
            <ChatMemberInfo />
        </div>
    );
}

// COMPS
function ChatMemberInfo() {
    const showAvatarInfo = () => (
        <div class="chat__infos pl-2 pl-md-0">
            <div class="chat-member__wrapper" data-online="true">
                <div class="chat-member__avatar">
                    <img
                        src="https://randomuser.me/api/portraits/thumb/women/56.jpg"
                        alt="Jenny Smith"
                        loading="lazy"
                    />
                    <div class="user-status user-status--large"></div>
                </div>
                <div class="chat-member__details">
                    <span class="chat-member__name">Jenny Smith</span>
                    <span class="chat-member__status">Online</span>
                </div>
            </div>
        </div>
    );

    const showBtnActions = () => {
        return (
            <div class="chat__actions mr-2 ">
                <ul class="m-0">
                    <li class="chat__details d-flex d-xl-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="svg-icon"
                            viewBox="0 0 42.2 11.1"
                        >
                            <g>
                                <circle
                                    cx="5.6"
                                    cy="5.6"
                                    r="5.6"
                                    fill="#d87232"
                                />
                                <circle
                                    cx="21.1"
                                    cy="5.6"
                                    r="5.6"
                                    fill="#d87232"
                                />
                                <circle
                                    cx="36.6"
                                    cy="5.6"
                                    r="5.6"
                                    fill="#d87232"
                                />
                            </g>
                        </svg>
                    </li>
                </ul>
            </div>
        );
    };

    return (
        <Fragment>
            {showAvatarInfo()}
            {showBtnActions()}
        </Fragment>
    );
}

function BadgeNewChat() {
    return (
        <div class="chat__notification d-flex d-md-none chat__notification--new">
            <span>1</span>
        </div>
    );
}
// END COMPS
