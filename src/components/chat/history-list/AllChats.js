import { Fragment } from "react";
import useContext from "context";
import getId from "utils/getId";
import { getSubjectBr } from "../helpers";

const truncate = (name, leng) => window.Helper.truncate(name, leng);

export default function AllChats({ mainDataList, isDev }) {
    const { setData, isSupport } = useContext();

    const handleOpenChat = (data) => {
        setData((prev) => ({ ...prev, openChat: getId(), chatData: data }));
    };

    return (
        <Fragment>
            <ChatSearcher isDev={isDev} isSupport={isSupport} />
            <ul className="messages-page__list pb-5 px-1 px-md-2">
                {mainDataList.map((data) => (
                    <li
                        key={data._id}
                        className={`messaging-member ${
                            data.newMsg ? "messaging-member--new" : ""
                        }`}
                        onClick={() => handleOpenChat(data)}
                    >
                        <div className="messaging-member__wrapper">
                            <div className="messaging-member__avatar">
                                <img
                                    src={data.avatar}
                                    alt={data.otherUserName}
                                    loading="lazy"
                                />
                                <div
                                    className={`user-status user-status${
                                        data.status === "online"
                                            ? "--online"
                                            : ""
                                    }`}
                                />
                            </div>

                            <span className="messaging-member__name">
                                {truncate(data.otherUserName, 20)}{" "}
                                {isSupport
                                    ? `(${getSubjectBr(data.subject)})`
                                    : ""}
                            </span>
                            <span className="d-block mt-2 messaging-member__message">
                                {getLastMsg(data.msgList)}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </Fragment>
    );
}

// COMPS
function ChatSearcher({ isDev, isSupport = true }) {
    return (
        <div className="messages-page__search mb-0 px-3 px-md-1 pb-3">
            <div className="custom-form__search-wrapper">
                <input
                    type="text"
                    className="form-control custom-form"
                    id="search"
                    placeholder={`Procure mensagem, ${
                        isSupport ? "assunto" : "usuário"
                    }${isDev ? ", assunto" : "..."}`}
                    autoComplete="off"
                />
                <button type="submit" className="custom-form__search-submit">
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
    );
}
// END COMPS

// HELPERS
function getLastMsg(msgList = []) {
    if (!msgList.length) return [];
    return msgList.slice(-1)[0].msgs.slice(-1)[0];
}
// END HELPERS

/*

<li className="messaging-member messaging-member--online messaging-member--active">
                <div className="messaging-member__wrapper">
                    <div className="messaging-member__avatar">
                        <img
                            src="https://randomuser.me/api/portraits/thumb/women/56.jpg"
                            alt="Jenny Smith"
                            loading="lazy"
                        />
                        <div className="user-status"></div>
                    </div>

                    <span className="messaging-member__name">
                        Jenny Smith
                    </span>
                    <span className="messaging-member__message">
                        Perfect, thanks !
                    </span>
                </div>
            </li>
            <li className="messaging-member">
                <div className="messaging-member__wrapper">
                    <div className="messaging-member__avatar">
                        <img
                            src="https://randomuser.me/api/portraits/thumb/women/17.jpg"
                            alt="Courtney Simmons"
                            loading="lazy"
                        />
                        <div className="user-status"></div>
                    </div>

                    <span className="messaging-member__name">
                        Courtney Simmons
                    </span>
                    <span className="messaging-member__message">
                        Going home soon, don't worry
                    </span>
                </div>
            </li>
            <li className="messaging-member messaging-member--online">
                <div className="messaging-member__wrapper">
                    <div className="messaging-member__avatar">
                        <img
                            src="https://randomuser.me/api/portraits/thumb/women/39.jpg"
                            alt="Martha Curtis"
                            loading="lazy"
                        />
                        <div className="user-status"></div>
                    </div>

                    <span className="messaging-member__name">
                        Martha Curtis
                    </span>
                    <span className="messaging-member__message">
                        Great 😂
                    </span>
                </div>
            </li>
            <li className="messaging-member messaging-member--online">
                <div className="messaging-member__wrapper">
                    <div className="messaging-member__avatar">
                        <img
                            src="https://randomuser.me/api/portraits/thumb/men/27.jpg"
                            alt="Rozie Tucker"
                            loading="lazy"
                        />
                        <div className="user-status"></div>
                    </div>

                    <span className="messaging-member__name">Gab Ryan</span>
                    <span className="messaging-member__message">
                        Sure, may I get your phone number? 😃
                    </span>
                </div>
            </li>
            <li className="messaging-member">
                <div className="messaging-member__wrapper">
                    <div className="messaging-member__avatar">
                        <img
                            src="https://randomuser.me/api/portraits/thumb/men/17.jpg"
                            alt="Jules Zimmermann"
                            loading="lazy"
                        />
                        <div className="user-status"></div>
                    </div>

                    <span className="messaging-member__name">
                        Jules Zimmermann
                    </span>
                    <span className="messaging-member__message">
                        Well, here I am, coming as faaast as I can !
                    </span>
                </div>
            </li>
            <li className="messaging-member">
                <div className="messaging-member__wrapper">
                    <div className="messaging-member__avatar">
                        <img
                            src="https://randomuser.me/api/portraits/thumb/men/9.jpg"
                            alt="Mark Reid"
                            loading="lazy"
                        />
                        <div className="user-status"></div>
                    </div>

                    <span className="messaging-member__name">
                        Mark Reid
                    </span>
                    <span className="messaging-member__message">
                        Have you listened to the latest album? Pure
                        perfection
                    </span>
                </div>
            </li>
            <li className="messaging-member  messaging-member--online">
                <div className="messaging-member__wrapper">
                    <div className="messaging-member__avatar">
                        <img
                            src="https://randomuser.me/api/portraits/thumb/men/54.jpg"
                            alt="Russell Williams"
                            loading="lazy"
                        />
                        <div className="user-status"></div>
                    </div>

                    <span className="messaging-member__name">
                        Russell Williams
                    </span>
                    <span className="messaging-member__message">
                        Nice to meet you again{" "}
                    </span>
                </div>
            </li>
            <li className="messaging-member">
                <div className="messaging-member__wrapper">
                    <div className="messaging-member__avatar">
                        <img
                            src="https://randomuser.me/api/portraits/thumb/women/85.jpg"
                            alt="Savannah Nguyen"
                            loading="lazy"
                        />
                        <div className="user-status"></div>
                    </div>

                    <span className="messaging-member__name">
                        Savannah Nguyen
                    </span>
                    <span className="messaging-member__message">
                        Really ?!
                    </span>
                </div>
            </li>

 */
