import { useState, useEffect } from "react";
import useContext from "context";
import getId from "utils/getId";
import isSameDay from "date-fns/isSameDay";
import useAutoresizeableTextarea from "hooks/useAutoresizeableTextarea";
import useAutoMsgBot from "pages/support/fiddelizeChatBot";
import getItems, { setItems } from "init/lStorage";
import getSubjectBr from "components/chat/helpers";
import UpperArea from "./UpperArea";
import ChatBubbles from "./ChatBubbles";
import MsgSender from "./MsgSender";

const isSmall = window.Helper.isSmallScreen();

const [chatTempLastFieldMsgs, chatDarkMode] = getItems("global", [
    "chatTempLastFieldMsgs",
    "chatDarkMode",
]);

const tempPostMsgs = {}; // tempPostMsgs are all msgs received and sent AFTER the first load. all these messages should be stored in-memory so they will not be lost when switch between chat roomIds
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
        // currInd,
        // dbList,
    } = useContext();

    const { loading } = dataChatList;

    const { dbMsgs = [], roomId, dataType } = currChatData;

    const isSupportOver = dataType && !dataType.isPendingSupport;

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

    const lastStoredMsg = getLastStoredMsg(dbMsgs, roomId);
    const lastMsgId = lastStoredMsg.content && lastStoredMsg.content.msgId;

    useEffect(() => {
        setCurrData((prev) => ({
            ...prev,
            msgList: getMsgList({
                roomId,
                dbMsgs,
            }),
            newMsg: tempLastFieldMsgs[roomId] || "",
            lastMsg: lastStoredMsg || {},
        }));
    }, [roomId, lastMsgId]);

    function appendNewMsg(currMsg) {
        // temp chat store

        addTempMsg({
            roomId: currMsg.to,
            newMsg: currMsg,
        });

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
            appendNewMsg(data);
            scrollToBottom();

            // Some other user messages were prevented to be displayed
            // avoid push in another chat room when updating the list
            // const msgInd = !dbList.length ? null : dbList.findIndex(session => session.roomId === data.to);

            // if (msgInd === currInd) {
            //     appendNewMsg(data);
            //     scrollToBottom();
            // }
        });
        // eslint-disable-next-line
    }, [socket, roomId]);

    function checkFirstMsgTodayDate() {
        // for the division of dates when it was sent.
        const content = lastMsg && lastMsg.content;
        const lastMsgDate =
            content && lastMsg.content.msgDate
                ? new Date(lastMsg.content.msgDate)
                : null;

        const isFirstMsgToday = !lastMsgDate
            ? true
            : !isSameDay(lastMsgDate, today);

        return isFirstMsgToday ? today : undefined;
    }

    const firstMsgTodayDate = checkFirstMsgTodayDate();

    const saveNewMsg = (botMsg, newImg) => {
        if (!newMsg && !botMsg && !newImg) return;

        // need reload chat list to display botMsg
        if (botMsg) socket.emit("updateBizRooms", { newUserRoomId: roomId }); // to join the user roomId automatically

        let newMsgTobeEmitted = {
            from: botMsg ? "Fidda Bot" : chatUserId,
            to: roomId,
            content: {
                msgId: `msg${getId()}`,
                msg: botMsg || newMsg,
                msgDate: today,
                firstMsgTodayDate,
                // notif
                role,
                chatTitle: `${chatUserName} (${getSubjectBr(subject)})`,
            },
        };

        if (newImg) newMsgTobeEmitted = newImg;

        const handleNewMsg = () => {
            if (newImg) return newImg.content && newImg.content.msg;
            return botMsg || newMsg;
        };

        socket.emit("newMsg", newMsgTobeEmitted);
        socket.emit("lastMsg", {
            newMsg: handleNewMsg(),
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

    const totalBotMsgs = loading
        ? null
        : msgList.length &&
          msgList.filter((m) => m.from === "Fidda Bot").length;
    const totalHumanMsgs = loading
        ? null
        : msgList.length &&
          msgList.filter((m) => m.from !== "Fidda Bot").length;

    useAutoMsgBot({
        subject,
        activateBot: role !== "nucleo-equipe" && totalBotMsgs === 0,
        activateBot2:
            role !== "nucleo-equipe" &&
            totalBotMsgs === 1 &&
            totalHumanMsgs >= 1,
        saveNewMsg,
        setCurrData,
        setData,
        socket,
        userName: chatUserName,
        roomId,
        role,
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
                        chatUserId={chatUserId}
                        roomId={roomId}
                        disabled={isSupportOver}
                        bot={bot}
                        role={role}
                        firstMsgTodayDate={firstMsgTodayDate}
                    />
                </div>
            </div>
        </div>
    );
}

function addTempMsg({ roomId, newMsg }) {
    const tempObj = tempPostMsgs;

    if (!tempObj[roomId]) tempObj[roomId] = [newMsg];
    else {
        // remove duplicates
        const alreadyGot = tempObj[roomId].find(
            (m) => m.content.msgId === newMsg.content.msgId
        );
        if (!alreadyGot) tempObj[roomId].push(newMsg);
    }
}

// both db and temp msgs
function getMsgList({ roomId, dbMsgs }) {
    if (!tempPostMsgs[roomId]) return dbMsgs;
    return [...dbMsgs, ...tempPostMsgs[roomId]];
}

function scrollToBottom() {
    const chatContainer = document.querySelector(".chat__content");
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
}

function getLastStoredMsg(dbMsgs, roomId) {
    const getLastOne = (list) => (list.length ? list.slice(-1)[0] : {});
    let list = tempPostMsgs[roomId] || [];
    if (!list.length) list = dbMsgs;

    return getLastOne(list);
}

function removeObjDuplicate({ list = [], filterId = "msgId", newObj }) {
    // originalArr - The array on which filter() was called.
    // findIndex - The findIndex() method returns the index of the first element in the array that satisfies the provided testing function. Otherwise, it returns -1, indicating that no element passed the test.
    if (!list || !list.length) return [];
    const finalList = !newObj ? list : [...list, newObj];

    return finalList.filter(
        (item1, ind, originalArr) =>
            originalArr.findIndex(
                (item2) => item2.content[filterId] === item1.content[filterId]
            ) === ind // if find the item, returns its ind which should be the same as filter method, then we can remove duplicates.
    );
}

// function toStr(data) {
//     return JSON.stringify(data);
// }

// reference: https://stackoverflow.com/questions/54134156/javascript-merge-two-arrays-of-objects-only-if-not-duplicate-based-on-specifi

// function mergeUniqueObjArrays(initialArray, newArray, id = "_id") {
//     const ids = new Set(initialArray.map((d) => d[id]));
//     const merged = [
//         ...initialArray,
//         ...newArray.filter((d) => !ids.has(d[id])),
//     ];
//     return merged;
// }

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
