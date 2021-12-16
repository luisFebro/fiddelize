import { useState, useEffect } from "react";
import useContext from "context";
import getId from "utils/getId";
import isSameDay from "date-fns/isSameDay";
import useAutoresizeableTextarea from "hooks/useAutoresizeableTextarea";
import useAutoMsgBot from "pages/support/fiddelizeChatBot";
import getItems, { setItems } from "init/lStorage";
import UpperArea from "./UpperArea";
import ChatBubbles from "./ChatBubbles";
import MsgSender from "./MsgSender";

const isSmall = window.Helper.isSmallScreen();

// all recent messges should be stored in-memory so they will not be lost when switch between chat roomIds
const tempRecentMsgs = {};

const [chatTempLastFieldMsgs, chatDarkMode] = getItems("global", [
    "chatTempLastFieldMsgs",
    "chatDarkMode",
]);

export default function ChatContent() {
    const [currData, setCurrData] = useState({
        newMsg: "",
        msgList: [],
        lastMsg: null, // object
        bot: {
            typingShow: false,
            senderName: null,
            roomId: null,
            sentMsg1: false,
        },
        tempLastFieldMsgs: chatTempLastFieldMsgs || {},
        pushTemp: false, // an random id to store temp lasg filed data
    });
    const {
        pushTemp,
        tempLastFieldMsgs,
        newMsg,
        msgList,
        lastMsg,
        bot,
    } = currData;
    const today = new Date();

    useAutoresizeableTextarea();

    const {
        openChat,
        currChatData,
        socket,
        chatUserId,
        chatUserName,
        setData,
        subject,
        dataChatList,
        tempLastPanelMsg,
        role,
    } = useContext();
    const { loading } = dataChatList;

    const { dbMsgs = [], roomId, dataType } = currChatData;

    const isSupportOver = dataType && !dataType.isPendingSupport;

    const lastStoredMsg = getLastStoredMsg(dbMsgs, roomId);
    scrollToBottom();

    useEffect(() => {
        if (pushTemp) {
            const tempObj = tempLastFieldMsgs;
            tempObj[roomId] = newMsg;

            setCurrData((prev) => ({
                ...prev,
                tempLastFieldMsgs: tempObj,
            }));

            setItems("global", {
                chatTempLastFieldMsgs: tempObj,
            });
        }
    }, [pushTemp]);

    useEffect(() => {
        setCurrData((prev) => ({
            ...prev,
            newMsg: tempLastFieldMsgs[roomId] || "",
        }));
        // eslint-disable-next-line
    }, [roomId]);

    useEffect(() => {
        const getMsgList = () => {
            console.log("tempRecentMsgs[roomId]", tempRecentMsgs[roomId]);
            console.log("tempRecentMsgs", tempRecentMsgs);
            if (!tempRecentMsgs[roomId]) return dbMsgs;
            return mergeUniqueObjArrays(dbMsgs, tempRecentMsgs[roomId]);
            // removeMultiObjDuplicate(prev.msgList, dbMsgs);
        };

        setCurrData((prev) => ({
            ...prev,
            msgList: getMsgList(),
            lastMsg: lastStoredMsg || {},
        }));
        // eslint-disable-next-line
    }, [roomId]); // if lastStoredMsg will cause max exceed reload error

    function appendNewMsg(currMsg) {
        const thisRoomId = currMsg.to;

        // temp chat store
        if (!tempRecentMsgs[thisRoomId]) tempRecentMsgs[thisRoomId] = [currMsg];
        else tempRecentMsgs[thisRoomId].push(currMsg);

        return setCurrData((prev) => ({
            ...prev,
            msgList: removeObjDuplicate({
                list: prev.msgList,
                newObj: currMsg,
            }),
            lastMsg: currMsg,
        }));
    }

    useEffect(() => {
        if (!socket) return;
        // solved in the backend with broadcast.emit! -- Don’t send the same message to the user that sent it. Instead, append the message directly as soon as he/she push a new msg.
        socket.on("newMsg", (data) => {
            // avoid push in another chat room when updating the list
            if (data.to === roomId) {
                appendNewMsg(data);
                scrollToBottom();
            }
        });
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

        const tempObj = tempLastFieldMsgs;
        tempObj[roomId] = "";
        setCurrData((prev) => ({
            ...prev,
            newMsg: "",
            tempLastFieldMsgs: tempObj,
        }));

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
        activateBot:
            role !== "nucleo-equipe" &&
            !loading &&
            !bot.sentMsg1 &&
            msgList.length === 0,
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
                        tempLastPanelMsg={tempLastPanelMsg}
                        socket={socket}
                        chatDarkMode={chatDarkMode}
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

function getLastStoredMsg(dbMsgs, roomId) {
    const getLastOne = (list) => (list.length ? list.slice(-1)[0] : {});
    let list = tempRecentMsgs[roomId] || [];
    if (!list.length) list = dbMsgs;

    return getLastOne(list);
}

function removeObjDuplicate({ list, filterId = "msgId", newObj }) {
    // originalArr - The array on which filter() was called.
    // findIndex - The findIndex() method returns the index of the first element in the array that satisfies the provided testing function. Otherwise, it returns -1, indicating that no element passed the test.

    return [...list, newObj].filter(
        (item1, ind, originalArr) =>
            originalArr.findIndex(
                (item2) => item2.content[filterId] === item1.content[filterId]
            ) === ind // if find the item, returns its ind which should be the same as filter method, then we can remove duplicates.
    );
}

// reference: https://stackoverflow.com/questions/54134156/javascript-merge-two-arrays-of-objects-only-if-not-duplicate-based-on-specifi

function mergeUniqueObjArrays(initialArray, newArray, id = "msgId") {
    const ids = new Set(initialArray.map((d) => d[id]));
    const merged = [
        ...initialArray,
        ...newArray.filter((d) => !ids.has(d[id])),
    ];
    return merged;
}

// TEMP LIST
function addTempMsg() {}

function getTempDbMsgList() {}

/*
TEST

// console.log(mergeUniqueObjArrays(initialData, newData))

var initialData = [{
    'msgId': 1,
    'FirstName': 'Sally'
  },
  {
    'msgId': 2,
    'FirstName': 'Jim'
  },
  {
    'msgId': 3,
    'FirstName': 'Bob'
  }
];

var newData = [{
    'msgId': 2,
    'FirstName': 'Jim'
  },
  {
    'msgId': 4,
    'FirstName': 'Tom'
  },
  {
    'msgId': 5,
    'FirstName': 'George'
  }
];


*/

// END HELPERS
