import { Fragment } from "react";

export default function HistoryList() {
    return (
        <Fragment>
            <div class="col-12 col-md-4 col-lg-5 col-xl-3 px-0 messages-page__list-scroll">
                <div class="messages-page__header mb-0 px-4 pt-3 pb-3">
                    <span class="messages-page__title">Histórico de Chats</span>
                    <DarkModeToggler />
                </div>
                <div class="messages-page__search mb-0 px-3 pb-3">
                    <div class="custom-form__search-wrapper">
                        <input
                            type="text"
                            class="form-control custom-form"
                            id="search"
                            placeholder="Rechercher un message, un utilisateur…"
                            autocomplete="off"
                        />
                        <button
                            type="submit"
                            class="custom-form__search-submit"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="svg-icon svg-icon--search"
                                viewBox="0 0 46.6 46.6"
                            >
                                <path
                                    d="M46.1,43.2l-9-8.9a20.9,20.9,0,1,0-2.8,2.8l8.9,9a1.9,1.9,0,0,0,1.4.5,2,2,0,0,0,1.5-.5A2.3,2.3,0,0,0,46.1,43.2ZM4,21a17,17,0,1,1,33.9,0A17.1,17.1,0,0,1,33,32.9h-.1A17,17,0,0,1,4,21Z"
                                    fill="#f68b3c"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <ul class="messages-page__list pb-5 px-1 px-md-3">
                    <li class="messaging-member messaging-member--new messaging-member--online">
                        <div class="messaging-member__wrapper">
                            <div class="messaging-member__avatar">
                                <img
                                    src="https://randomuser.me/api/portraits/thumb/men/74.jpg"
                                    alt="Bessie Cooper"
                                    loading="lazy"
                                />
                                <div class="user-status"></div>
                            </div>

                            <span class="messaging-member__name">
                                Bessie Cooper
                            </span>
                            <span class="messaging-member__message">
                                Yes, I need your help with the project, it need
                                it done by tomorrow 😫
                            </span>
                        </div>
                    </li>
                    <li class="messaging-member messaging-member--online messaging-member--active">
                        <div class="messaging-member__wrapper">
                            <div class="messaging-member__avatar">
                                <img
                                    src="https://randomuser.me/api/portraits/thumb/women/56.jpg"
                                    alt="Jenny Smith"
                                    loading="lazy"
                                />
                                <div class="user-status"></div>
                            </div>

                            <span class="messaging-member__name">
                                Jenny Smith
                            </span>
                            <span class="messaging-member__message">
                                Perfect, thanks !
                            </span>
                        </div>
                    </li>
                    <li class="messaging-member">
                        <div class="messaging-member__wrapper">
                            <div class="messaging-member__avatar">
                                <img
                                    src="https://randomuser.me/api/portraits/thumb/women/17.jpg"
                                    alt="Courtney Simmons"
                                    loading="lazy"
                                />
                                <div class="user-status"></div>
                            </div>

                            <span class="messaging-member__name">
                                Courtney Simmons
                            </span>
                            <span class="messaging-member__message">
                                Going home soon, don't worry
                            </span>
                        </div>
                    </li>
                    <li class="messaging-member messaging-member--online">
                        <div class="messaging-member__wrapper">
                            <div class="messaging-member__avatar">
                                <img
                                    src="https://randomuser.me/api/portraits/thumb/women/39.jpg"
                                    alt="Martha Curtis"
                                    loading="lazy"
                                />
                                <div class="user-status"></div>
                            </div>

                            <span class="messaging-member__name">
                                Martha Curtis
                            </span>
                            <span class="messaging-member__message">
                                Great 😂
                            </span>
                        </div>
                    </li>
                    <li class="messaging-member messaging-member--online">
                        <div class="messaging-member__wrapper">
                            <div class="messaging-member__avatar">
                                <img
                                    src="https://randomuser.me/api/portraits/thumb/men/27.jpg"
                                    alt="Rozie Tucker"
                                    loading="lazy"
                                />
                                <div class="user-status"></div>
                            </div>

                            <span class="messaging-member__name">Gab Ryan</span>
                            <span class="messaging-member__message">
                                Sure, may I get your phone number? 😃
                            </span>
                        </div>
                    </li>
                    <li class="messaging-member">
                        <div class="messaging-member__wrapper">
                            <div class="messaging-member__avatar">
                                <img
                                    src="https://randomuser.me/api/portraits/thumb/men/17.jpg"
                                    alt="Jules Zimmermann"
                                    loading="lazy"
                                />
                                <div class="user-status"></div>
                            </div>

                            <span class="messaging-member__name">
                                Jules Zimmermann
                            </span>
                            <span class="messaging-member__message">
                                Well, here I am, coming as faaast as I can !
                            </span>
                        </div>
                    </li>
                    <li class="messaging-member">
                        <div class="messaging-member__wrapper">
                            <div class="messaging-member__avatar">
                                <img
                                    src="https://randomuser.me/api/portraits/thumb/men/9.jpg"
                                    alt="Mark Reid"
                                    loading="lazy"
                                />
                                <div class="user-status"></div>
                            </div>

                            <span class="messaging-member__name">
                                Mark Reid
                            </span>
                            <span class="messaging-member__message">
                                Have you listened to the latest album? Pure
                                perfection
                            </span>
                        </div>
                    </li>
                    <li class="messaging-member  messaging-member--online">
                        <div class="messaging-member__wrapper">
                            <div class="messaging-member__avatar">
                                <img
                                    src="https://randomuser.me/api/portraits/thumb/men/54.jpg"
                                    alt="Russell Williams"
                                    loading="lazy"
                                />
                                <div class="user-status"></div>
                            </div>

                            <span class="messaging-member__name">
                                Russell Williams
                            </span>
                            <span class="messaging-member__message">
                                Nice to meet you again{" "}
                            </span>
                        </div>
                    </li>
                    <li class="messaging-member">
                        <div class="messaging-member__wrapper">
                            <div class="messaging-member__avatar">
                                <img
                                    src="https://randomuser.me/api/portraits/thumb/women/85.jpg"
                                    alt="Savannah Nguyen"
                                    loading="lazy"
                                />
                                <div class="user-status"></div>
                            </div>

                            <span class="messaging-member__name">
                                Savannah Nguyen
                            </span>
                            <span class="messaging-member__message">
                                Really ?!
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </Fragment>
    );
}

function DarkModeToggler() {
    return (
        <div class="messages-page__dark-mode-toogler">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="svg-icon svg-icon--dark-mode"
                viewBox="0 0 49.7 49.7"
            >
                <path
                    d="M25.4,49.7A25.6,25.6,0,0,1,1.3,32.3,25.6,25.6,0,0,1,17.3.1a2,2,0,0,1,2.1.5,2.2,2.2,0,0,1,.5,2.1,19.9,19.9,0,0,0-1.2,6.8A21,21,0,0,0,25,24.7,21,21,0,0,0,40.2,31h0a20.9,20.9,0,0,0,6.9-1.2,2,2,0,0,1,2.5,2.5,25.8,25.8,0,0,1-16,16.1A28.7,28.7,0,0,1,25.4,49.7ZM15,5.5A21.4,21.4,0,0,0,5.1,31.1,21.5,21.5,0,0,0,15.9,43.4a21.2,21.2,0,0,0,28.3-8.8,17.5,17.5,0,0,1-4,.4h0a24.9,24.9,0,0,1-18-7.5,24.9,24.9,0,0,1-7.5-18A26.9,26.9,0,0,1,15,5.5Z"
                    fill="#f68b3c"
                />
            </svg>
        </div>
    );
}
