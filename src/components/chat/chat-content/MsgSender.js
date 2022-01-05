import { Fragment, useEffect, useState, useCallback } from "react";
import ChatTyping from "components/loadingIndicators/ChatTyping";
import useContext from "context";
import debounce from "utils/performance/debounce";
import getId from "utils/getId";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChatPhotoSender from "./chat-photo-sender/ChatPhotoSender";

const isSmall = window.Helper.isSmallScreen();

export default function MsgSender({
    newMsg,
    setCurrData,
    saveNewMsg,
    socket,
    roomId,
    disabled = false,
    tempLastPanelMsg,
    bot = {},
    chatDarkMode,
    chatUserId,
    firstMsgTodayDate,
    role,
}) {
    const [typingData, setTypingData] = useState({
        isUserTyping: null,
        typingShow: false,
        senderName: null,
        draftSaving: false,
    });
    const { draftSaving, isUserTyping, typingShow, senderName } = typingData;
    const { setData, chatUserName, typing } = useContext();

    useEffect(() => {
        if (!socket) return null;

        // this socket typing will trigger another called typingShow to other user(s);
        const setSocketStatus = (status) => {
            socket.emit("typing", {
                roomId,
                senderName: status === false ? null : chatUserName,
                typingShow: status,
            });
        };

        // every falsy or truthy cond is supposed to run once, since it will be true boolean which will next time will be same value until set false
        if (isUserTyping) return setSocketStatus(true);
        return setSocketStatus(false);
        // eslint-disable-next-line
    }, [socket, isUserTyping]);

    useEffect(() => {
        if (!socket) return;

        socket.on("lastMsgShow", (data) => {
            const getTempLastPanelMsg = () => {
                const tempObj = tempLastPanelMsg || {};
                tempObj[data.roomId] = data.newMsg;

                return tempObj;
            };

            setData((prev) => ({
                ...prev,
                tempLastPanelMsg: getTempLastPanelMsg(),
                lastPanelMsg: {
                    msg: data.newMsg,
                    roomId: data.roomId,
                },
            }));
        });

        socket.on("typingShow", (data) => {
            setData((prev) => ({
                ...prev,
                typing: {
                    roomId: data.roomId,
                    display: data.typingShow,
                    name: data.senderName,
                },
            }));
            setTypingData((prev) => ({
                ...prev,
                typingShow: data.typingShow,
                senderName: data.senderName,
            }));
        });
    }, [socket]);

    const handleUserStopTyping = () => {
        setTypingData((prev) => ({
            ...prev,
            isUserTyping: false,
            draftSaving: true,
        }));
        setTimeout(() => {
            setCurrData((prev) => ({ ...prev, pushTemp: getId() }));
            setTypingData((prev) => ({ ...prev, draftSaving: false }));
        }, 1500);
    };

    const handleUserStartTyping = () => {
        setTypingData((prev) => ({ ...prev, isUserTyping: true }));
    };

    // debounce is not triggered in the initial loading, waits for keydownpressing here
    // Important: they must have diff wait seconds. Otherwise, only once will work
    // eslint-disable-next-line
    const onChangeDetectTypingOff = useCallback(
        debounce(handleUserStopTyping, 1000),
        []
    );
    // this method is executed right away and wait 3 seconds to trigger again if user no longer stroking.
    // eslint-disable-next-line
    const onChangeDetectTypingOn = useCallback(
        debounce(handleUserStartTyping, 500, {
            leading: true,
            trailing: false,
        }),
        []
    );
    const onClickSendBtn = () => {
        saveNewMsg();
        setTypingData((prev) => ({ ...prev, isUserTyping: null }));
    };

    const showDraftStatus = () => (
        <section
            className="animated fadeIn delay-3s text-small position-absolute"
            style={{
                bottom: -20,
                left: 45,
                zIndex: 20,
            }}
        >
            <p
                style={{
                    color: chatDarkMode ? "#696969" : "#696969",
                }}
            >
                Rascunho: {draftSaving ? "salvando..." : "salvo!"}{" "}
                {!draftSaving && (
                    <FontAwesomeIcon
                        icon="check-circle"
                        style={{
                            fontSize: 15,
                        }}
                        className="ml-1"
                    />
                )}
            </p>
        </section>
    );

    const handleNewImg = (newImgData) => {
        saveNewMsg(null, { newImg: newImgData });
    };

    // bot typing is for the own user and doesn't need verify roomId
    return (
        <Fragment>
            <ChatTyping
                show={Boolean(
                    bot.typingShow ||
                        (typing && typing.roomId === roomId && typingShow)
                )}
                userFirstName={bot.senderName || senderName}
                isBot={bot.typingShow}
            />
            <div className="chat__send-container px-2 px-md-3 pt-1 pt-md-3 mb-2">
                <div
                    className="custom-form__send-wrapper shadow-field"
                    style={{
                        bottom: isSmall ? "-20px" : undefined,
                    }}
                >
                    <textarea
                        style={{
                            border: "0.2px solid grey",
                        }}
                        rows={1}
                        col={1}
                        disabled={disabled}
                        type="text"
                        name="newMsg"
                        value={newMsg}
                        onChange={(e) => {
                            setCurrData((prev) => ({
                                ...prev,
                                newMsg: e.target.value,
                            }));
                            onChangeDetectTypingOff();
                            onChangeDetectTypingOn();
                        }}
                        className="msg-sender form-control custom-form"
                        id="message"
                        placeholder=""
                        autoComplete="off"
                    />
                    <ChatPhotoSender
                        disabled={disabled}
                        role={role}
                        currRoomId={roomId}
                        from={chatUserId}
                        firstMsgTodayDate={firstMsgTodayDate}
                        callback={handleNewImg}
                    />
                    <button
                        type="submit"
                        className={`custom-form__send-submit ${
                            disabled ? "disabled" : ""
                        }`}
                        onClick={onClickSendBtn}
                        disabled={disabled}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="svg-icon svg-icon--send"
                            viewBox="0 0 45.6 45.6"
                        >
                            <g>
                                <path
                                    d="M20.7,26.7a1.4,1.4,0,0,1-1.2-.6,1.6,1.6,0,0,1,0-2.4L42.6.5a1.8,1.8,0,0,1,2.5,0,1.8,1.8,0,0,1,0,2.5L21.9,26.1A1.6,1.6,0,0,1,20.7,26.7Z"
                                    fill="#d87232"
                                />
                                <path
                                    d="M29.1,45.6a1.8,1.8,0,0,1-1.6-1L19.4,26.2,1,18.1a1.9,1.9,0,0,1-1-1.7,1.8,1.8,0,0,1,1.2-1.6L43.3.1a1.7,1.7,0,0,1,1.8.4,1.7,1.7,0,0,1,.4,1.8L30.8,44.4a1.8,1.8,0,0,1-1.6,1.2ZM6.5,16.7l14.9,6.6a2,2,0,0,1,.9.9l6.6,14.9L41,4.6Z"
                                    fill="#d87232"
                                />
                            </g>
                        </svg>
                    </button>
                </div>
                {newMsg && showDraftStatus()}
            </div>
        </Fragment>
    );
}

/*

<div
    className={`${
        disabled ? "disabled-link" : ""
    } custom-form__send-emoji`}
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="svg-icon svg-icon--send-emoji"
        viewBox="0 0 46.2 46.2"
    >
        <path
            d="M23.1,0A23.1,23.1,0,1,0,46.2,23.1,23.1,23.1,0,0,0,23.1,0Zm0,41.6A18.5,18.5,0,1,1,41.6,23.1,18.5,18.5,0,0,1,23.1,41.6Zm8.1-20.8a3.5,3.5,0,0,0,3.5-3.5,3.5,3.5,0,0,0-7,0,3.5,3.5,0,0,0,3.5,3.5ZM15,20.8a3.5,3.5,0,0,0,3.5-3.5A3.5,3.5,0,0,0,15,13.9a3.4,3.4,0,0,0-3.4,3.4A3.5,3.5,0,0,0,15,20.8Zm8.1,15a12.6,12.6,0,0,0,10.5-5.5,1.7,1.7,0,0,0-1.3-2.6H14a1.7,1.7,0,0,0-1.4,2.6A12.9,12.9,0,0,0,23.1,35.8Z"
            fill="#f68b3c"
        />
    </svg>
</div>

 */
