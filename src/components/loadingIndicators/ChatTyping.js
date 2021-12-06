import { useReadUI } from "global-data/ui";
import LoadingThreeDots from "./LoadingThreeDots.js";

export default function ChatTyping({ userFirstName, show = true }) {
    const { chatDarkMode } = useReadUI("global");
    const backColor = chatDarkMode ? "var(--themePLight)" : "var(--themePDark)";
    const txtColor = chatDarkMode ? "#868686" : "var(--themePDark)";

    return (
        show && (
            <section className="animated fadeInUp position-relative">
                <div className="chat-typing--root">
                    <LoadingThreeDots color="white" />
                    <div className="small-dot" />
                    <style jsx>
                        {`
                            .chat-typing--root {
                                display: table;
                                bottom: -5px;
                                position: relative;
                                padding: 1px;
                                margin-left: 20px;
                                background: ${backColor};
                                border-radius: 20px;
                            }

                            .chat-typing--root .small-dot {
                                position: absolute;
                                bottom: -10px;
                                left: -10px;
                                width: 10px;
                                height: 10px;
                                border-radius: 50%;
                                background-color: ${backColor};
                            }
                        `}
                    </style>
                </div>
                <span
                    className="d-block position-relative text-em-0-9 text-nowrap font-site"
                    style={{
                        bottom: -5,
                        marginLeft: 25,
                        color: txtColor,
                    }}
                >
                    <strong>{userFirstName}</strong> está respondendo...
                </span>
            </section>
        )
    );
}
