import { Fragment, useState, useEffect } from "react";
import useContext from "context";
import getId from "utils/getId";
import Avatar from "@material-ui/core/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parse from "html-react-parser";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";
import RadiusBtn from "components/buttons/RadiusBtn";
import getSubjectBr from "../helpers";

const isSmall = window.Helper.isSmallScreen();

const truncate = (name, leng) => window.Helper.truncate(name, leng);

export default function AllChats({ isBizTeam }) {
    const {
        setData,
        isSupport,
        socket,
        currChatData,
        dbList,
        role,
        updateChatList,
        setSkip,
        setSearch,
        dataChatList,
        needStatus,
        typing,
        lastPanelMsg,
        tempLastPanelMsg,
    } = useContext();

    const {
        listTotal,
        needEmptyIllustra,
        // isPlural,
        hasMore,
        loading,
        ShowLoading,
        error,
        ShowError,
        isOffline,
    } = dataChatList;

    const handleOpenChat = (currData) => {
        if (!currData) return;

        socket.emit("joinRoom", currData.roomId);
        // NOte: this doesn't work cuz returns to the first caht in the list when updated -- update all other chats on click
        // if(!currData.firstChat) socket.emit("updateBizRooms");

        if (socket.disconnected) {
            socket.connect();
        }
        setData((prev) => ({
            ...prev,
            openChat: getId(),
            currRoomId: currData.roomId,
        })); // need to clear field every time user enter a chat panel, otherwise the prior msg will appear in every chat panel in the list

        setTimeout(() => {
            scrollToBottom();
        }, 50);
    };

    useEffect(() => {
        // for smaller devices, the panel is closed and chat need to be clicked
        if (!isSmall) handleOpenChat(dbList[0]);
    }, [loading]);

    const getDataStatus = (data) => `
        user-status user-status${
            data.otherStatus === "online" ? "--online" : ""
        }
    `;

    const showEmptyIllustration = () => (
        <section
            className="animated fadeInUp position-relative mx-3 my-5 container-center-col"
            style={{
                top: -220,
            }}
        >
            <img
                width={200}
                src="/img/illustrations/empty-data.svg"
                alt="nada encontrado"
            />
            <h2 className="mt-3 font-size text-em-1-1 font-weight-bold text-grey">
                Nada encontrado.
            </h2>
        </section>
    );

    // INFINITY LOADING LIST
    const detectedCard = useElemDetection({
        loading,
        hasMore,
        setSkip,
        isOffline,
    });

    const getRoleInTitle = (data) =>
        isBizTeam
            ? `: <span class="text-em-0-9">${data.otherUserRole}</span>)`
            : ")";

    const checkSelectedUser = (data) =>
        currChatData && currChatData._id === data._id ? "selected-chat" : "";

    const showSupportCheckIcon = () => (
        <div
            className="position-absolute"
            style={{
                bottom: 5,
                right: 5,
            }}
        >
            <FontAwesomeIcon
                icon="check-circle"
                style={{
                    fontSize: 25,
                    color: "green",
                }}
            />
        </div>
    );

    const showCard = (data, ind) => (
        <li
            className={`messaging-member ${checkSelectedUser(data)} ${
                data.unreadCount >= 1 ? "messaging-member--new" : ""
            }`}
            onClick={() => handleOpenChat(data)}
        >
            <div className="position-relative messaging-member__wrapper">
                <div className="messaging-member__avatar">
                    {getAvatarSelection({
                        avatar: data.otherAvatar,
                        otherUserName: data.otherUserName,
                        currUserRole: role,
                        needGreyColor:
                            data.dataType && !data.dataType.isPendingSupport,
                    })}
                    <div
                        className={`${needStatus ? getDataStatus(data) : ""}`}
                    />
                </div>

                <span className="messaging-member__name">
                    {truncate(data.otherUserName, 20)}{" "}
                    {isSupport
                        ? parse(
                              `(${getSubjectBr(
                                  data.dataType.subject
                              )}${getRoleInTitle(data)}`
                          )
                        : ""}
                </span>
                <span className="d-block mt-2 messaging-member__message">
                    {handleLastMsg({
                        typing,
                        ind,
                        data,
                        lastPanelMsg,
                        tempLastPanelMsg,
                    })}
                </span>
                {data.dataType &&
                    !data.dataType.isPendingSupport &&
                    showSupportCheckIcon()}
            </div>
        </li>
    );

    const listMap = dbList.map((data, ind) =>
        checkDetectedElem({ list: dbList, ind, indFromLast: 2 }) ? (
            <section key={data._id} ref={detectedCard}>
                {showCard(data, ind)}
            </section>
        ) : (
            <section key={data._id}>{showCard(data)}</section>
        )
    );
    // END INFINITY LOADING LIST

    return (
        <Fragment>
            <ChatSearcher
                updateChatList={updateChatList}
                setSearch={setSearch}
                setSkip={setSkip}
            />
            <p className="ml-3">
                Total de: <strong>{listTotal}</strong>{" "}
                {isBizTeam ? "clientes" : "assuntos"}
            </p>
            <ul
                className={`messages-page__list ${
                    !loading ? "" : "pb-5"
                } px-1 px-md-2`}
            >
                {listMap}
            </ul>
            {loading && <ShowLoading size="small" marginY={0} />}
            {needEmptyIllustra && showEmptyIllustration()}
            {error && <ShowError />}
        </Fragment>
    );
}

// COMPS

export function getAvatarSelection({
    avatar,
    currUserRole,
    otherUserName,
    size,
    needGreyColor = false,
}) {
    const needAvatar = currUserRole === "nucleo-equipe";
    if (needAvatar)
        return (
            <div className="all-chats-avatar-letters">
                <Avatar
                    style={{
                        backgroundColor: needGreyColor
                            ? "grey"
                            : stringToHexColor(otherUserName),
                        width: size,
                        height: size,
                    }}
                >
                    {getFirstLetters(otherUserName)}
                </Avatar>
                <style jsx global>
                    {`
                        .all-chats-avatar-letters .MuiAvatar-root {
                            width: 55px;
                            height: 55px;
                            font-family: var(--mainFont);
                            font-size: 1.8rem;
                            text-shadow: 1px 1px 3px black;
                        }
                    `}
                </style>
            </div>
        );

    return (
        <img
            style={{
                filter: needGreyColor ? "grayscale(1)" : "none",
            }}
            src={avatar}
            alt={otherUserName}
            loading="lazy"
        />
    );
}

function ChatSearcher({ setSearch, setSkip, updateChatList }) {
    const [newSearch, setNewSearch] = useState("");
    const handleNewSearch = () => {
        if (!newSearch) return;

        setSkip(0);
        setSearch(newSearch);
    };

    const showCleanBtn = () => {
        const onCleanBtn = () => {
            setNewSearch("");
            updateChatList();
        };

        return (
            <div
                className="position-absolute"
                style={{
                    bottom: -15,
                    right: 35,
                }}
            >
                <RadiusBtn
                    position="relative"
                    backgroundColor="var(--themeSDark)"
                    title="limpar"
                    size="extra-small"
                    fontSize="15px"
                    onClick={onCleanBtn}
                />
            </div>
        );
    };

    return (
        <section className="position-relative">
            <div className="messages-page__search mb-0 px-3 px-md-1 pb-3">
                <div className="custom-form__search-wrapper">
                    <input
                        type="text"
                        className="shadow-field form-control custom-form"
                        id="search"
                        name="newSearch"
                        value={newSearch}
                        onChange={(e) => setNewSearch(e.target.value)}
                        placeholder="Procure um assunto"
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        className="custom-form__search-submit"
                        onClick={handleNewSearch}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="svg-icon svg-icon--search"
                            viewBox="0 0 46.6 46.6"
                        >
                            <path
                                d="M46.1,43.2l-9-8.9a20.9,20.9,0,1,0-2.8,2.8l8.9,9a1.9,1.9,0,0,0,1.4.5,2,2,0,0,0,1.5-.5A2.3,2.3,0,0,0,46.1,43.2ZM4,21a17,17,0,1,1,33.9,0A17.1,17.1,0,0,1,33,32.9h-.1A17,17,0,0,1,4,21Z"
                                fill="#f68b3c"
                            />
                        </svg>
                    </button>
                </div>
                <style jsx>
                    {`
                        .form-control {
                            display: block;
                            width: 100%;
                            height: calc(1.5em + 0.75rem + 2px);
                            padding: 0.375rem 0.75rem;
                            font-size: 1rem;
                            font-weight: 400;
                            line-height: 1.5;
                            color: #495057;
                            background-color: #fff;
                            background-clip: padding-box;
                            border: 1px solid #ced4da;
                            border-radius: 0.25rem;
                            transition: border-color 0.15s ease-in-out,
                                box-shadow 0.15s ease-in-out;
                        }

                        .custom-form {
                            color: var(--colour-text-darkest);
                            padding: 1.5rem;
                            border-radius: 13px;
                        }
                    `}
                </style>
            </div>
            {newSearch && showCleanBtn()}
        </section>
    );
}
// END COMPS

// HELPERS
function handleLastMsg({ typing, ind, data, lastPanelMsg, tempLastPanelMsg }) {
    const getLastMsg = (dbMsgs = []) => {
        if (!dbMsgs.length) return "";
        return dbMsgs.slice(-1)[0].content.msg;
    };

    // if still not detected the currnt roomId, set only the first chat to be displayed
    const isBot = ind === 0 && typing.display && typing.name === "Fidda Bot";
    const isUserTyping =
        isBot || (typing.display && typing.roomId === data.roomId);
    if (isUserTyping) return `${typing.name} está digitando...`;

    const recentSentMsg =
        tempLastPanelMsg[data.roomId] ||
        (lastPanelMsg.msg && lastPanelMsg.roomId === data.roomId);
    if (recentSentMsg) return tempLastPanelMsg[data.roomId] || lastPanelMsg.msg;

    return getLastMsg(data.dbMsgs);
}

function getFirstLetters(name, options = {}) {
    const { limit = 2, upperCase = true } = options;

    if (!name) return "";
    const splitNames = name.split(" ");
    const letters = [];

    splitNames.forEach((word, ind) => {
        const currPos = ind + 1;
        if (currPos > limit) return null;

        const newLetter = upperCase ? word[0].toUpperCase() : word[0];
        return letters.push(newLetter);
    });

    return letters.join("");
}

function stringToHexColor(string) {
    if (!string) return "";

    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}
// END HELPERS

function scrollToBottom() {
    const chatContainer = document.querySelector(".chat__content");
    const xH = chatContainer.scrollHeight;
    if (chatContainer) chatContainer.scrollTo(0, xH);
    // chatContainer.scrollTop = chatContainer.scrollHeight;
}
/* ARCHIVES
`Procure mensagem, ${
    isSupport ? "assunto" : "usuário"
}${isBizTeam ? ", assunto" : "..."}`
*/
