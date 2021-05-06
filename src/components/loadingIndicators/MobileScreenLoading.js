import { CLIENT_URL } from "../../config/clientUrl";

export default function MobileScreenLoading({ color, backgroundColor }) {
    return (
        <section className="position-relative">
            <div
                className="container-center-col"
                style={{
                    color: color || "var(--mainWhite)",
                    padding: "105px 0",
                    backgroundColor: backgroundColor || "var(--lightPurple)",
                }}
            >
                <img
                    className="svg-elevation pulse-it"
                    id="logo"
                    src={`${CLIENT_URL}/img/official-logo-white.png`}
                    alt="logo carregando..."
                    height="150px"
                />
                <section className="root-bounce loading-container text-shadow">
                    <h2 className="loading-text">Carregando</h2>
                    <div className="spinner text-shadow">
                        <div className="bounce1" />
                        <div className="bounce2" />
                        <div className="bounce3" />
                    </div>
                    <style jsx global>
                        {`
                            .root-bounce {
                                display: flex;
                                flex-direction: row;
                                justify-content: center;
                                align-items: center;
                                margin-top: 40px;
                            }

                            .loading-text {
                                color: ${color || "var(--mainWhite)"};
                                fontweight: bold;
                            }

                            .root-bounce .spinner {
                                //margin: 100px auto 0;
                                width: 70px;
                                text-align: center;
                            }

                            .root-bounce .spinner > div {
                                margin: 5px;
                                width: 6px;
                                height: 6px;
                                background-color: var(--mainWhite);
                                filter: drop-shadow(
                                    0.001em 0.1em 0.1em var(--mainDark)
                                );

                                border-radius: 100%;
                                display: inline-block;
                                animation: bounceDots 1.4s infinite ease-in-out
                                    both;
                            }

                            .root-bounce .spinner .bounce1 {
                                animation-delay: -0.32s;
                            }

                            .root-bounce .spinner .bounce2 {
                                animation-delay: -0.16s;
                            }

                            @keyframes bounceDots {
                                0%,
                                80%,
                                100% {
                                    transform: scale(0);
                                }
                                40% {
                                    transform: scale(1);
                                }
                            }
                        `}
                    </style>
                </section>
            </div>
        </section>
    );
}
