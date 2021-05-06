import { CLIENT_URL } from "../../config/clientUrl";

export default function FullPageLoading({ color, backgroundColor }) {
    return (
        <section className="root">
            <img
                className="svg-elevation pulse-it"
                id="logo"
                src={`${CLIENT_URL}/img/official-logo-white.png`}
                alt="logo carregando..."
                height="150px"
            />
            <section className="loading-container">
                <h2 className="loading-text">Carregando</h2>
                <div className="spinner">
                    <div className="bounce1" />
                    <div className="bounce2" />
                    <div className="bounce3" />
                </div>
            </section>
            <style jsx global>
                {`
                    .root {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        display: flex;
                        justify-content: center;
                        flex-direction: column;
                        align-items: center;
                        background: ${backgroundColor || "var(--mainWhite)"};
                        color: var(--mainDark);
                        z-index: 999;
                    }

                    .loading-container {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        margin-top: 40px;
                    }

                    .loading-text {
                        color: ${color || "var(--mainPurple)"};
                        fontweight: bold;
                    }

                    .root .spinner {
                        //margin: 100px auto 0;
                        width: 70px;
                        text-align: center;
                    }

                    .root .spinner > div {
                        margin: 5px;
                        width: 6px;
                        height: 6px;
                        background-color: #333;

                        border-radius: 100%;
                        display: inline-block;
                        animation: bounceDots 1.4s infinite ease-in-out both;
                    }

                    .root .spinner .bounce1 {
                        animation-delay: -0.32s;
                    }

                    .root .spinner .bounce2 {
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
    );
}

//Three-dot bouncing loading effect
//Resource: https://codepen.io/danielmorosan/pen/XmYBVx
