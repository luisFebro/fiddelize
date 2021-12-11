import { Fragment } from "react";
import useContext from "context";
import animateCSS from "utils/animateCSS";
import getId from "utils/getId";
import FinishSubjectBtn from "./FinishSubjectBtn";
import { getAvatarSelection } from "../history-list/AllChats";
import getSubjectBr from "../helpers";

export default function UpperArea() {
    const {
        setData,
        currChatData,
        isSupport,
        role,
        updateChatList,
        socket,
        needStatus,
    } = useContext();

    const handleCloseChat = () => {
        const chat = document.querySelector(".chat");
        animateCSS(chat, "zoomOut", "fast", () => {
            // socket.disconnect(true); // user can return to channel list and still be online, so this is commented out for now.
            setData((prev) => ({ ...prev, openChat: false }));
        });
    };

    return (
        <div className="chat__messaging messaging-member--online pb-2 pb-md-2 px-2 pl-md-4">
            <div
                className="chat__previous d-flex d-md-none"
                onClick={handleCloseChat}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="svg-icon svg-icon--previous"
                    viewBox="0 0 45.5 30.4"
                >
                    <path
                        d="M43.5,13.1H7l9.7-9.6A2.1,2.1,0,1,0,13.8.6L.9,13.5h0L.3,14v.6c0,.1-.1.1-.1.2v.4a2,2,0,0,0,.6,1.5l.3.3L13.8,29.8a2.1,2.1,0,1,0,2.9-2.9L7,17.2H43.5a2,2,0,0,0,2-2A2.1,2.1,0,0,0,43.5,13.1Z"
                        fill="#f68b3c"
                    />
                </svg>
            </div>
            <BadgeNewChat />
            <ChatMemberInfo
                updateChatList={updateChatList}
                currChatData={currChatData}
                setData={setData}
                isSupport={isSupport}
                role={role}
                socket={socket}
                needStatus={needStatus}
            />
        </div>
    );
}

// COMPS
function ChatMemberInfo({
    setData,
    currChatData,
    isSupport,
    role,
    socket,
    needStatus,
}) {
    const {
        otherUserName,
        otherAvatar,
        otherStatus,
        roomId,
        dataType,
    } = currChatData;

    const subjectBr = getSubjectBr(dataType && dataType.subject);
    const isSupportOver = dataType && !dataType.isPendingSupport;
    const isOnline = otherStatus === "online";

    const showAvatarInfo = () => (
        <div className="chat__infos pl-2 pl-md-0">
            <div className="chat-member__wrapper">
                <div className="chat-member__avatar">
                    {getAvatarSelection({
                        size: 45,
                        avatar: otherAvatar,
                        otherUserName,
                        currUserRole: role,
                        needGreyColor: isSupportOver,
                    })}
                    {needStatus && (
                        <div
                            className={`user-status user-status${
                                isOnline ? "--online" : ""
                            }`}
                        />
                    )}
                </div>
                <div className="chat-member__details">
                    <span
                        className="text-wrap chat-member__name"
                        style={{
                            marginTop: needStatus ? "auto" : "-25px",
                        }}
                    >
                        {otherUserName || "Nenhum cliente"}{" "}
                        {isSupport ? `(${subjectBr})` : ""}
                    </span>
                    {needStatus && (
                        <span className="chat-member__status">
                            {isOnline ? "Online" : "Offline"}
                        </span>
                    )}
                </div>
                {!isSupportOver && otherUserName && (
                    <FinishSubjectBtn
                        subject={subjectBr}
                        roomId={roomId}
                        socket={socket}
                    />
                )}
            </div>
        </div>
    );

    const handleOnClick = () => {
        setData((prev) => ({
            ...prev,
            openUserCard: getId(),
        }));
    };

    const showBtnActions = () => (
        <div className="chat__actions mr-2 ">
            <ul className="m-0">
                <li
                    className="chat__details d-flex d-xl-none"
                    onClick={handleOnClick}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="svg-icon"
                        viewBox="0 0 42.2 11.1"
                    >
                        <g>
                            <circle cx="5.6" cy="5.6" r="5.6" fill="#d87232" />
                            <circle cx="21.1" cy="5.6" r="5.6" fill="#d87232" />
                            <circle cx="36.6" cy="5.6" r="5.6" fill="#d87232" />
                        </g>
                    </svg>
                </li>
            </ul>
        </div>
    );

    return (
        <Fragment>
            {showAvatarInfo()}
            {showBtnActions()}
        </Fragment>
    );
}

function BadgeNewChat() {
    const display = false;
    return (
        display && (
            <div className="d-none chat__notification d-flex d-md-none chat__notification--new">
                <span>1</span>
            </div>
        )
    );
}
// END COMPS
