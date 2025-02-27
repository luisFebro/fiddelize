import { useState, useEffect } from "react";
import useContext from "context";
import getId from "utils/getId";
import isSameDay from "date-fns/isSameDay";
import useAutoresizeableTextarea from "hooks/useAutoresizeableTextarea";
import useAutoMsgBot from "pages/support/fiddelizeChatBot";
import getItems, { setItems } from "init/lStorage";
import getSubjectBr from "components/chat/helpers";
import { isAlreadyAllowed } from "components/pwa-push-notification/pushNotifPermission";
import useData from "init";
import UpperArea from "./UpperArea";
import ChatBubbles from "./ChatBubbles";
import MsgSender from "./MsgSender";

const isSmall = window.Helper.isSmallScreen();

const [chatTempLastFieldMsgs, chatDarkMode, chatRoomId] = getItems("global", [
    "chatTempLastFieldMsgs",
    "chatDarkMode",
    "chatRoomId",
]);

const tempPostMsgs = {}; // tempPostMsgs are all msgs received and sent AFTER the first load. all these messages should be stored in-memory so they will not be lost when switch between chat roomIds
export default function ChatContent() {
    const [currData, setCurrData] = useState({
        newMsg: "", // this is actually an object with msg strin in content.msg
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

    const { email } = useData();

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

    let { roomId } = currChatData;
    const { dbMsgs = [], dataType } = currChatData;
    roomId = roomId || chatRoomId;

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

    const saveNewMsg = (botMsg, options = {}) => {
        const {
            newImg,
            msgType = undefined,
            updateBizRooms = true,
            notifyData,
        } = options;

        if (!newMsg && !botMsg && !newImg) return;

        // need reload chat list to display botMsg
        const needUpdateBizRooms = botMsg && updateBizRooms;
        if (needUpdateBizRooms)
            socket.emit("updateBizRooms", { newUserRoomId: roomId }); // to join the user roomId automatically

        // for identify when sending automatically an email to the customer
        const totalStaffMsgs =
            loading || role !== "nucleo-equipe"
                ? null
                : msgList.length &&
                  msgList.filter(
                      (m) =>
                          m.from !== "Fidda Bot" &&
                          m.content &&
                          m.content.role === "nucleo-equipe"
                  ).length;

        // if zero, it means it is the first msg sent by a Fiddelize Staff
        const triggerNotifyEmail =
            newMsg && role === "nucleo-equipe" && totalStaffMsgs === 0;

        let newMsgTobeEmitted = {
            from: botMsg ? "Fidda Bot" : chatUserId,
            to: roomId,
            content: {
                msgType,
                msgId: `msg${getId()}`,
                msg: botMsg || newMsg,
                msgDate: today,
                firstMsgTodayDate,
                // notif
                role,
                chatTitle: `${chatUserName} (${getSubjectBr(subject)})`,
            },
            extra: {
                triggerNotifyEmail,
                notifyData,
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

    let lastBotMsg = loading
        ? null
        : msgList.length &&
          msgList.filter((msg) => msg.from === "Fidda Bot").slice(-1)[0]; // returns an empty array if empty filter, and undefined for last item
    lastBotMsg =
        lastBotMsg && lastBotMsg.content ? lastBotMsg.content.msg : null;

    // identify whether the last msg is a bot or a human
    const whichMsgType = (isFiddaBot) => (isFiddaBot ? "bot" : "human");
    let lastMsgType = msgList.length && msgList.slice(-1)[0];
    lastMsgType = loading
        ? null
        : whichMsgType(lastMsgType && lastMsgType.from === "Fidda Bot");

    let lastCustomerMsg = loading
        ? null
        : msgList.length &&
          msgList
              .filter(
                  (msg) =>
                      msg.from !== "Fidda Bot" &&
                      msg.content &&
                      msg.content.role !== "nucleo-equipe"
              )
              .slice(-1)[0];
    lastCustomerMsg =
        lastCustomerMsg && lastCustomerMsg.content
            ? lastCustomerMsg.content.msg
            : null;

    const totalBotMsgs = loading
        ? null
        : msgList.length &&
          msgList.filter((m) => m.from === "Fidda Bot").length;
    // const totalCustomerMsgs = loading
    //     ? null
    //     : msgList.length &&
    //       msgList.filter(
    //           (m) =>
    //               m.from !== "Fidda Bot" &&
    //               m.content &&
    //               m.content.role !== "nucleo-equipe"
    //       ).length;

    const alreadyNotifWarning = loading
        ? null
        : msgList.length
        ? msgList.some(
              (m) =>
                  m.content.msg &&
                  m.content.msg.includes("Você receberá uma notif") &&
                  m.from === "Fidda Bot"
          )
        : false;

    const isVisitor = role === "visitante" && !isAlreadyAllowed;
    const isLoggedCustomer = role !== "visitante";

    useAutoMsgBot({
        subject,
        msgBot01: isVisitor && role !== "nucleo-equipe" && totalBotMsgs === 0,
        msgBot02:
            isVisitor &&
            role !== "nucleo-equipe" &&
            lastBotMsg &&
            lastBotMsg.includes("EMAIL principal"),
        msgBot1:
            isLoggedCustomer &&
            alreadyNotifWarning === false &&
            role !== "nucleo-equipe",
        saveNewMsg,
        setCurrData,
        setData,
        socket,
        userName: chatUserName,
        roomId,
        role,
        lastBotMsg,
        lastMsgType,
        lastCustomerMsg,
        loggedUserEmail: email,
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
                    <ChatBubbles msgList={msgList} saveNewMsg={saveNewMsg} />
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
