import useContext from "context";
import getId from "utils/getId";

export default function MessagingPanel({ mainDataList }) {
    const { setData } = useContext();

    const handleOpenChat = (data) => {
        setData((prev) => ({ ...prev, openChat: getId(), chatData: data }));
    };

    return (
        <ul className="messages-page__list pb-5 px-1 px-md-3">
            {mainDataList.map((data) => (
                <li
                    key={data._id}
                    className={`messaging-member messaging-member--new messaging-member--${data.status}`}
                    onClick={() => handleOpenChat(data)}
                >
                    <div className="messaging-member__wrapper">
                        <div className="messaging-member__avatar">
                            <img
                                src={data.avatar}
                                alt={data.otherUserName}
                                loading="lazy"
                            />
                            <div className="user-status" />
                        </div>

                        <span className="messaging-member__name">
                            {data.userName}
                        </span>
                        <span className="messaging-member__message">
                            {data.lastMsg}
                        </span>
                    </div>
                </li>
            ))}
        </ul>
    );
}

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
