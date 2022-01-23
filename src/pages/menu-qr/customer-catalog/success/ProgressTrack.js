import { Fragment, useEffect, useState } from "react";

export default function ProgressTrack({ stage }) {
    const showProgressMsg = () => {
        const selectedMsg = getSelectedMsg(stage);

        return (
            <p
                className="mt-5 mx-3 text-normal text-pill text-center"
                style={{
                    backgroundColor: "var(--themePDark)",
                }}
            >
                {selectedMsg}
            </p>
        );
    };

    const showIllustration = () => (
        <Fragment>
            {stage === "queue" && (
                <div className="container-center">
                    <img
                        width={100}
                        height={100}
                        src="/img/icons/digital-menu/queue.svg"
                        alt="Na fila"
                    />
                </div>
            )}
            {stage === "preparing" && (
                <div className="container-center">
                    <img
                        width={100}
                        height={100}
                        src="/img/icons/digital-menu/preparing.svg"
                        alt="No preparado"
                    />
                </div>
            )}
            {stage === "done" && (
                <div className="container-center animated rubberBand repeat-2">
                    <img
                        width={100}
                        height={100}
                        src="/img/icons/digital-menu/done.svg"
                        alt="Feito"
                    />
                </div>
            )}
        </Fragment>
    );

    return (
        <section className="text-white text-normal text-shadow">
            <h2 className="mt-0 mb-2 text-normal font-weight-bold text-center">
                Seu pedido em tempo real:
            </h2>
            {showIllustration()}
            <TrackArea stage={stage} />
            {showProgressMsg()}
        </section>
    );
}

// COMP
//
function TrackArea({ stage }) {
    const [allowWave, setAllowWave] = useState(true);

    useEffect(() => {
        setAllowWave(true);
        const runWave = setTimeout(() => setAllowWave(false), 10000);

        return () => {
            clearTimeout(runWave);
        };
    }, [stage]);

    return (
        <div className="track-area--root">
            <span
                className={`circle ${
                    ["queue", "preparing", "done"].includes(stage)
                        ? "paint-track spot-one"
                        : ""
                } ${stage === "queue" && allowWave ? "pulse-waves" : ""}`}
            >
                <p>Fila</p>
            </span>
            <span
                className={`line ${
                    ["preparing", "done"].includes(stage)
                        ? "paint-track spot-two"
                        : ""
                }`}
            />
            <span
                className={`circle ${
                    ["preparing", "done"].includes(stage)
                        ? "paint-track spot-two"
                        : ""
                } ${stage === "preparing" && allowWave ? "pulse-waves" : ""}`}
            >
                <p>Preparo</p>
            </span>
            <span
                className={`line ${
                    stage === "done" ? "paint-track spot-three" : ""
                }`}
            />
            <span
                className={`circle ${
                    stage === "done" ? "paint-track spot-three" : ""
                } ${stage === "done" && allowWave ? "pulse-waves" : ""}`}
            >
                <p>Feito</p>
            </span>
            <style jsx>
                {`
                    .track-area--root {
                        position: relative;
                        display: flex;
                        align-items: center;
                        margin: 50px 20px 0px;
                    }

                    .track-area--root .circle {
                        position: relative;
                        border-color: transparent;
                        display: block;
                        outline: none;
                        padding: 10px;
                        height: 50px;
                        width: 50px;
                        background: grey;
                        border-radius: 50% 50%;
                    }

                    .track-area--root span p {
                        position: relative;
                        top: -45px;
                        left: -10px;
                        white-space: nowrap;
                        size: 15px;
                    }

                    .track-area--root .line {
                        display: block;
                        width: 110%;
                        height: 10px;
                        background: grey;
                        border-radius: "50% 50%";
                    }

                    .track-area--root .spot-one,
                    .track-area--root .spot-two,
                    .track-area--root .spot-three {
                        background: #ff0;
                    }

                    .paint-track {
                        animation: paintTrack 3s ease-out 1 normal forwards;
                        transition: all 1s;
                        filter: drop-shadow(#ff0 0px 0px 0.9px);
                    }

                    @keyframes paintTrack {
                        0% {
                            background-color: var(--mainWhite);
                        }
                        100% {
                            background-color: rgba(250, 250, 0);
                        }
                    }

                    .pulse-waves {
                        position: relative;
                        width: 20px;
                        height: 20px;
                        padding: 1px;
                        origin: center;
                        border-radius: 50%;
                        background-color: 0 0 0 30px rgba(255, 255, 0, 0.2);
                        cursor: pointer;
                        z-indez: -1;
                        animation: pulse 1.25s infinite
                            cubic-bezier(0.66, 0, 0, 1);
                    }

                    @keyframes pulse {
                        to {
                            box-shadow: 0 0 0 30px rgba(255, 255, 0, 0.2);
                        }
                    }
                `}
            </style>
        </div>
    );
}
// END COMP

// HELPERS
function getSelectedMsg(stage) {
    if (stage === "queue")
        return "Seu pedido foi recebido e logo será preparado.";
    if (stage === "preparing") return "Estamos preparando seu pedido agora!";
    // done
    return "Opa! Pedido pronto e a caminho. Bom apetite!";
}
// END HELPERS
