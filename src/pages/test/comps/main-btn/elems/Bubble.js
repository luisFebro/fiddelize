export default function Bubble({ connectStatus = "" }) {
    const valStore = {
        connected: {
            neonSizeInset: "1.2rem",
            lightShades: [".2rem", ".2rem", "1rem", "0.8rem", "1.8rem"],
        },
        connecting: {
            neonSizeInset: "1.2rem",
            lightShades: [".1rem", ".1rem", "0.5rem", "0.4rem", "0.9rem"],
        },
        disconnected: {
            neonSizeInset: "0.8rem",
            lightShades: ["0.1rem", "0.1rem", "0.1rem", "0.1rem", "0.1rem"],
        },
    };

    return (
        <section class="bubble--root stage">
            <figure
                class={`ball bubble connectStatus ${
                    connectStatus === "connected" ? "animate-bubble" : ""
                }`}
            />
            <style jsx>
                {`
                    .bubble--root .ball.bubble.animate-bubble {
                        -webkit-animation: bubble-anim 1s ease-out 3;
                        animation: bubble-anim 1s ease-out 3;
                    }

                    .bubble--root .ball {
                        background: radial-gradient(
                            circle at 50% 55%,
                            rgba(33, 37, 41, 0.9),
                            rgba(33, 37, 41, 0.9) 40%,
                            rgba(33, 37, 41, 0.8) 60%,
                            rgba(33, 37, 41, 0.4)
                        );
                    }

                    .bubble--root .ball {
                        /* neon */
                        box-shadow: 0 0
                                ${valStore[connectStatus].lightShades[0]}
                                var(--${connectStatus}),
                            0 0 ${valStore[connectStatus].lightShades[1]}
                                var(--${connectStatus}),
                            0 0 ${valStore[connectStatus].lightShades[2]}
                                var(--${connectStatus}),
                            0 0 ${valStore[connectStatus].lightShades[3]}
                                var(--${connectStatus}),
                            0 0 ${valStore[connectStatus].lightShades[4]}
                                var(--${connectStatus}),
                            inset 0 0 ${valStore[connectStatus].neonSizeInset}
                                var(--${connectStatus}); /* before #1cf499 */
                    }
                `}
            </style>
            <style jsx>
                {`
                    .bubble--root .ball {
                        display: inline-block;
                        width: 110px;
                        height: 110px;
                        border-radius: 100%;
                        position: relative;
                        top: 37px;
                    }

                    .bubble--root .ball:before {
                        content: "";
                        position: absolute;
                        top: 1%;
                        left: 5%;
                        width: 60%;
                        height: 60%;
                        border-radius: 100%;
                        background: radial-gradient(
                            circle at top,
                            white,
                            rgba(255, 255, 255, 0) 58%
                        );
                        -webkit-filter: blur(5px);
                        filter: blur(30px);
                        z-index: 2;
                    }

                    .bubble--root .ball:after {
                        content: "";
                        position: absolute;
                        display: none;
                        top: 5%;
                        left: 10%;
                        width: 80%;
                        height: 80%;
                        border-radius: 100%;
                        -webkit-filter: blur(1px);
                        filter: blur(1px);
                        z-index: 2;
                        -webkit-transform: rotateZ(-30deg);
                        transform: rotateZ(-30deg);
                    }

                    .bubble--root .ball .shadow {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        background: radial-gradient(
                            circle,
                            rgba(0, 0, 0, 0.4),
                            rgba(0, 0, 0, 0.1) 40%,
                            rgba(0, 0, 0, 0) 50%
                        );
                        transform: rotateX(90deg) translateZ(-160px);
                        z-index: 1;
                    }

                    .bubble--root .ball.plain {
                        background: black;
                    }

                    .bubble--root .ball.plain:before,
                    .ball.plain:after {
                        display: none;
                    }

                    .bubble--root .ball.bubble:before {
                        -webkit-filter: blur(0);
                        filter: blur(0);
                        height: 40%;
                        width: 30%;
                        background: radial-gradient(
                            circle at 130% 130%,
                            rgba(255, 255, 255, 0) 0,
                            rgba(255, 255, 255, 0) 46%,
                            rgba(255, 255, 255, 0.8) 50%,
                            rgba(255, 255, 255, 0.8) 58%,
                            rgba(255, 255, 255, 0) 60%,
                            rgba(255, 255, 255, 0) 100%
                        );
                        -webkit-transform: translateX(131%) translateY(58%)
                            rotateZ(168deg) rotateX(10deg);
                        transform: translateX(200%) translateY(158%)
                            rotateZ(178deg) rotateX(10deg);
                    }

                    .bubble--root .ball.bubble:after {
                        display: block;
                        background: radial-gradient(
                            circle at 50% 80%,
                            rgba(255, 255, 255, 0),
                            rgba(255, 255, 255, 0) 74%,
                            white 80%,
                            white 84%,
                            rgba(255, 255, 255, 0) 100%
                        );
                    }

                    .bubble--root .stage {
                        width: 300px;
                        height: 300px;
                        display: inline-block;
                        margin: 20px;
                    }

                    @-webkit-keyframes bubble-anim {
                        0% {
                            -webkit-transform: scale(1);
                            transform: scale(1);
                        }

                        20% {
                            -webkit-transform: scaleY(0.95) scaleX(1.05);
                            transform: scaleY(0.95) scaleX(1.05);
                        }

                        48% {
                            -webkit-transform: scaleY(1.1) scaleX(0.9);
                            transform: scaleY(1.1) scaleX(0.9);
                        }

                        68% {
                            -webkit-transform: scaleY(0.98) scaleX(1.02);
                            transform: scaleY(0.98) scaleX(1.02);
                        }

                        80% {
                            -webkit-transform: scaleY(1.02) scaleX(0.98);
                            transform: scaleY(1.02) scaleX(0.98);
                        }

                        97%,
                        100% {
                            -webkit-transform: scale(1);
                            transform: scale(1);
                        }
                    }

                    @keyframes bubble-anim {
                        0% {
                            -webkit-transform: scale(1);
                            transform: scale(1);
                        }

                        20% {
                            -webkit-transform: scaleY(0.95) scaleX(1.05);
                            transform: scaleY(0.95) scaleX(1.05);
                        }

                        48% {
                            -webkit-transform: scaleY(1.1) scaleX(0.9);
                            transform: scaleY(1.1) scaleX(0.9);
                        }

                        68% {
                            -webkit-transform: scaleY(0.98) scaleX(1.02);
                            transform: scaleY(0.98) scaleX(1.02);
                        }

                        80% {
                            -webkit-transform: scaleY(1.02) scaleX(0.98);
                            transform: scaleY(1.02) scaleX(0.98);
                        }

                        97%,
                        100% {
                            -webkit-transform: scale(1);
                            transform: scale(1);
                        }
                    }
                `}
            </style>
        </section>
    );
}
