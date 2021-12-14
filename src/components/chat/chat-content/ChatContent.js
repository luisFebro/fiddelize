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
            typingShow: false,
            senderName: null,
            roomId: null,
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
        dataChatList,
        role,
    } = useContext();
    const { loading } = dataChatList;

    const { dbMsgs = [], roomId, dataType } = currChatData;

    const isSupportOver = dataType && !dataType.isPendingSupport;

    const lastDbMsg = dbMsgs.length ? dbMsgs.slice(-1)[0] : {};
    scrollToBottom();

    useEffect(() => {
        setCurrData((prev) => ({
            ...prev,
            msgList: dbMsgs || [],
            lastMsg: lastDbMsg || {},
        }));
        // eslint-disable-next-line
    }, [roomId]); // if lastDbMsg will cause max exceed reload error

    useEffect(() => {
        if (clearFieldMsg) setCurrData((prev) => ({ ...prev, newMsg: "" }));
    }, [clearFieldMsg]);

    function appendNewMsg(currMsg) {
        function removeDuplicate(prev) {
            const filterId = "msgId";
            // originalArr - The array on which filter() was called.
            // findIndex - The findIndex() method returns the index of the first element in the array that satisfies the provided testing function. Otherwise, it returns -1, indicating that no element passed the test.
            return [...prev.msgList, currMsg].filter(
                (item1, ind, originalArr) =>
                    originalArr.findIndex(
                        (item2) =>
                            item2.content[filterId] === item1.content[filterId]
                    ) === ind // if find the item, returns its ind which should be the same as filter method, then we can remove duplicates.
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
            // avoid push in another chat room when updating the list
            console.log("data.to === roomId", data.to === roomId);
            console.log("data.to", data.to);
            if (data.to === roomId) {
                appendNewMsg(data);
                scrollToBottom();
            }
        });
        console.log("roomId CHAT", roomId);
        // eslint-disable-next-line
    }, [socket, roomId]);

    const saveNewMsg = (botMsg) => {
        if (!newMsg && !botMsg) return;
        // need reload chat list to display botMsg
        if (botMsg) socket.emit("updateBizRooms");

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
        socket.emit("lastMsg", {
            newMsg: botMsg || newMsg,
            roomId,
        });

        appendNewMsg(newMsgTobeEmitted);
        setCurrData((prev) => ({ ...prev, newMsg: "" }));

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
        activateBot: role !== "nucleo-equipe" && !loading && dbMsgs.length <= 0,
        saveNewMsg,
        setCurrData,
        setData,
        socket,
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
// END HELPERS
