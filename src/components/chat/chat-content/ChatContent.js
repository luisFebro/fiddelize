import { useState, useEffect } from "react";
import useContext from "context";
import getId from "utils/getId";
import isSameDay from "date-fns/isSameDay";
import useAutoresizeableTextarea from "hooks/useAutoresizeableTextarea";
import useAutoMsgBot from "pages/support/fiddelizeChatBot";
import UpperArea from "./UpperArea";
import ChatBubbles from "./ChatBubbles";
import MsgSender from "./MsgSender";

const isSmall = window.Helper.isSmallScreen();

export default function ChatContent() {
    const [currData, setCurrData] = useState({
        newMsg: "",
        msgList: [],
        lastMsg: null, // object
        bot: {
            typingDisplay: false,
            senderName: null,
        },
    });
    const { newMsg, msgList, lastMsg, bot } = currData;
    const today = new Date();

    useAutoresizeableTextarea();

    const {
        openChat,
        currChatData,
        socket,
        chatUserId,
        chatUserName,
        clearFieldMsg = false,
        setData,
        subject,
    } = useContext();

    const { dbMsgs = [], roomId, dataType } = currChatData;
    const isSupportOver = dataType && !dataType.isPendingSupport;

    const lastDbMsg = dbMsgs.length ? dbMsgs.slice(-1)[0] : {};

    useEffect(() => {
        if (!dbMsgs.length) return;

        setCurrData((prev) => ({
            ...prev,
            msgList: dbMsgs,
            lastMsg: lastDbMsg,
        }));
        // eslint-disable-next-line
    }, [dbMsgs.length]); // if lastDbMsg will cause max exceed reload error

    scrollToBottom();

    useEffect(() => {
        if (clearFieldMsg) setCurrData((prev) => ({ ...prev, newMsg: "" }));
    }, [clearFieldMsg]);

    function appendNewMsg(currMsg) {
        function removeDuplicate(prev) {
            const filterId = "msgId";
            return [...prev.msgList, currMsg].filter(
                (val, ind, arr) =>
                    arr.findIndex(
                        (t) => t.content[filterId] === val.content[filterId]
                    ) === ind
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
            showLastPanelMsg({
                setData,
                newMsg: data.content && data.content.msg,
                roomId,
            });
            scrollToBottom();
        });
        // eslint-disable-next-line
    }, [socket]);

    const saveNewMsg = (botMsg) => {
        if (!newMsg && !botMsg) return;

        // for the division of dates when it was sent.
        const content = lastMsg && lastMsg.content;
        const lastMsgDate =
            content && lastMsg.content.msgDate
                ? new Date(lastMsg.content.msgDate)
                : null;

        const isFirstMsgToday = !lastMsgDate
            ? true
            : !isSameDay(lastMsgDate, today);

        const newMsgTobeEmitted = {
            from: botMsg ? "Fidda Bot" : chatUserId,
            to: roomId,
            content: {
                msgId: `msg${getId()}`,
                msg: botMsg || newMsg,
                msgDate: today,
                firstMsgTodayDate: isFirstMsgToday ? today : undefined,
            },
        };

        socket.emit("newMsg", newMsgTobeEmitted);

        appendNewMsg(newMsgTobeEmitted);
        setCurrData((prev) => ({ ...prev, newMsg: "" }));

        showLastPanelMsg({
            setData,
            newMsg,
            roomId,
        });
        scrollToBottom();

        // focus after sending:
        const newMsgTxt = document.querySelector(".msg-sender");
        // keep size of field after focusing.
        setTimeout(() => {
            newMsgTxt.focus();
            newMsgTxt.style.height = "72px";
        }, 1000);
    };

    useAutoMsgBot({
        subject,
        activateBot: !dbMsgs.length,
        saveNewMsg,
        setCurrData,
        setData,
        userName: chatUserName,
        roomId,
    });

    const showLockChatMsg = () => (
        <div className="container-center">
            <span
                className="mb-3 mb-md-0 text-shadow text-pill font-site text-em-1"
                style={{
                    background: "grey",
                }}
            >
                Este assunto foi finalizado
            </span>
        </div>
    );

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
                    <ChatBubbles msgList={msgList} />
                    {isSupportOver && showLockChatMsg()}
                    <MsgSender
                        newMsg={newMsg}
                        setCurrData={setCurrData}
                        saveNewMsg={saveNewMsg}
                        socket={socket}
                        roomId={roomId}
                        disabled={isSupportOver}
                        bot={bot}
                    />
                </div>
            </div>
        </div>
    );
}

function scrollToBottom() {
    const chatContainer = document.querySelector(".chat__content");
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
}

function showLastPanelMsg({ setData, newMsg, roomId }) {
    const lastPanelMsg = {
        msg: newMsg,
        roomId,
    };
    setData((prev) => ({ ...prev, lastPanelMsg }));
}
// END HELPERS
