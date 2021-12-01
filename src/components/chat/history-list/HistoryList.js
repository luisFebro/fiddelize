import { Fragment } from "react";
import useData from "init";
import useContext from "context";
import { setItems } from "init/lStorage";
import MessagingPanel from "./MessagingPanel";

export default function HistoryList() {
    const { agentJob } = useData();
    const { mainDataList, setDarkMode } = useContext();

    const isDev = agentJob === "dev";

    return (
        <Fragment>
            <div className="col-12 col-md-4 col-lg-5 col-xl-3 px-0 messages-page__list-scroll">
                <div className="messages-page__header mb-0 px-4 pt-3 pb-3">
                    <span className="messages-page__title">
                        Histórico de Chats
                    </span>
                    <DarkModeToggler setDarkMode={setDarkMode} />
                </div>
                <ChatSearcher isDev={isDev} />

                <MessagingPanel mainDataList={mainDataList} />
            </div>
        </Fragment>
    );
}

function ChatSearcher({ isDev }) {
    return (
        <div className="messages-page__search mb-0 px-3 pb-3">
            <div className="custom-form__search-wrapper">
                <input
                    type="text"
                    className="form-control custom-form"
                    id="search"
                    placeholder={`Procure uma mensagem, usuário${
                        isDev ? ", ou assunto" : "..."
                    }`}
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
        </div>
    );
}

function DarkModeToggler({ setDarkMode = () => null }) {
    const handleDarkMode = () => {
        setDarkMode((prev) => {
            setItems("global", {
                chatDarkMode: !prev,
            });
            return !prev;
        });
    };

    return (
        <div
            className="messages-page__dark-mode-toogler"
            onClick={handleDarkMode}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="svg-icon svg-icon--dark-mode"
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
