import useContext from "context";
import UpperArea from "./UpperArea";
import ChatBubbles from "./ChatBubbles";

export default function ChatContent() {
    const { openChat, chatData } = useContext();
    const { msgList } = chatData;

    return (
        <div
            className={`${
                openChat ? "d-block animated fadeInUp" : "d-none"
            } chat col-12 col-md-8 col-lg-7 col-xl-6 px-0 pl-md-1`}
        >
            <div className="chat__container">
                <div className="chat__wrapper py-2 pt-mb-2 pb-md-3">
                    <UpperArea />
                    <ChatBubbles msgList={msgList} />
                    <div className="chat__send-container px-2 px-md-3 pt-1 pt-md-3">
                        <div className="custom-form__send-wrapper">
                            <input
                                type="text"
                                className="form-control custom-form"
                                id="message"
                                placeholder="Escreva sua mensagem"
                                autoComplete="off"
                            />
                            <div className="custom-form__send-img">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="svg-icon svg-icon--send-img"
                                    viewBox="0 0 45.7 45.7"
                                >
                                    <path
                                        d="M6.6,45.7A6.7,6.7,0,0,1,0,39.1V6.6A6.7,6.7,0,0,1,6.6,0H39.1a6.7,6.7,0,0,1,6.6,6.6V39.1h0a6.7,6.7,0,0,1-6.6,6.6ZM39,4H6.6A2.6,2.6,0,0,0,4,6.6V39.1a2.6,2.6,0,0,0,2.6,2.6H39.1a2.6,2.6,0,0,0,2.6-2.6V6.6A2.7,2.7,0,0,0,39,4Zm4.7,35.1Zm-4.6-.4H6.6a2.1,2.1,0,0,1-1.8-1.1,2,2,0,0,1,.3-2.1l8.1-10.4a1.8,1.8,0,0,1,1.5-.8,2.4,2.4,0,0,1,1.6.7l4.2,5.1,6.6-8.5a1.8,1.8,0,0,1,1.6-.8,1.8,1.8,0,0,1,1.5.8L40.7,35.5a2,2,0,0,1,.1,2.1A1.8,1.8,0,0,1,39.1,38.7Zm-17.2-4H35.1l-6.5-8.6-6.5,8.4C22,34.6,22,34.7,21.9,34.7Zm-11.2,0H19l-4.2-5.1Z"
                                        fill="#f68b3c"
                                    />
                                </svg>
                            </div>
                            <div className="custom-form__send-emoji">
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
                            <button
                                type="submit"
                                className="custom-form__send-submit"
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
                    </div>
                </div>
            </div>
        </div>
    );
}
