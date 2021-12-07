import { useState, useEffect } from "react";
import useContext from "context";
import getId from "utils/getId";
import isSameDay from "date-fns/isSameDay";
import useAutoresizeableTextarea from "hooks/useAutoresizeableTextarea";
import UpperArea from "./UpperArea";
import ChatBubbles from "./ChatBubbles";
import MsgSender from "./MsgSender";

const isSmall = window.Helper.isSmallScreen();

export default function ChatContent() {
    const [currData, setCurrData] = useState({
        newMsg: "",
        msgList: [],
        lastMsg: null, // object
    });
    const { newMsg, msgList, lastMsg } = currData;
    const today = new Date();

    useAutoresizeableTextarea();

    const {
        openChat,
        currChatData,
        socket,
        chatUserId,
        clearFieldMsg = false,
    } = useContext();

    const { dbMsgs = {}, type, roomId } = currChatData;

    useEffect(() => {
        if (clearFieldMsg) setCurrData((prev) => ({ ...prev, newMsg: "" }));
    }, [clearFieldMsg]);

    function appendNewMsg(currMsg) {
        function removeDuplicate(prev) {
            const filterId = "msgId";
            return [...prev.msgList, currMsg].filter(
                (val, ind, arr) =>
                    arr.findIndex((t) => t[filterId] === val[filterId]) === ind
            );
        }

        return setCurrData((prev) => ({
            ...prev,
            msgList: removeDuplicate(prev),
            lastMsg: currMsg,
        }));
    }

    useEffect(() => {
        if (!socket) return;
        // solved in the backend with broadcast.emit! -- Don’t send the same message to the user that sent it. Instead, append the message directly as soon as he/she push a new msg.
        socket.on("newMsg", (data) => {
            appendNewMsg(data);
            scrollToBottom();
        });
        // eslint-disable-next-line
    }, [socket]);

    const lastDbMsg = dbMsgs.length ? dbMsgs.slice(-1)[0] : [];

    useEffect(() => {
        if (!msgList.length)
            setCurrData((prev) => ({
                ...prev,
                msgList: dbMsgs,
                lastMsg: lastDbMsg,
            }));
        // eslint-disable-next-line
    }, [msgList.length]); // if lastDbMsg will cause max exceed reload error

    const saveNewMsg = () => {
        if (!newMsg) return;

        // for the division of dates when it was sent.
        const lastMsgDate = lastMsg.msgDate ? new Date(lastMsg.msgDate) : null;

        const isFirstMsgToday = !lastMsgDate
            ? true
            : !isSameDay(lastMsgDate, today);

        const newMsgTobeEmitted = {
            msgId: `msg${getId()}`,
            userId: chatUserId,
            roomId,
            chatType: type,
            isFirstMsgEver: lastDbMsg.length === 0, // if true, we have to create a new document in the chat collection
            isFirstMsgToday,
            bubble: "me",
            msg: newMsg,
            msgDate: today,
            firstMsgTodayDate: isFirstMsgToday ? today : undefined,
        };

        socket.emit("newMsg", newMsgTobeEmitted);

        appendNewMsg(newMsgTobeEmitted);
        setCurrData((prev) => ({ ...prev, newMsg: "" }));

        scrollToBottom();
    };

    return (
        <div
            className={`${
                openChat
                    ? `d-block ${isSmall ? "animated fadeInUp" : ""}`
                    : "d-none"
            } chat chat--mobile col-12 col-md-8 col-lg-7 col-xl-6 px-0 pl-md-1`}
        >
            <div className="chat__container">
                <div className="chat__wrapper py-2 pt-mb-2 pb-md-3">
                    <UpperArea />
                    <ChatBubbles msgList={msgList} socket={socket} />
                    <MsgSender
                        newMsg={newMsg}
                        setCurrData={setCurrData}
                        saveNewMsg={saveNewMsg}
                        socket={socket}
                        roomId={roomId}
                    />
                </div>
            </div>
        </div>
    );
}

// HELPERS
function scrollToBottom() {
    const chatContainer = document.querySelector(".chat__content");
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
// END HELPERS
