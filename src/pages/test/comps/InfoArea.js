import { Fragment, useEffect, useState } from "react";
import stopWatch from "utils/numbers/stopWatch";
import Flash from "styles/icons/ion/Flash";
import Alarm from "styles/icons/ion/Alarm";

const statusStore = {
    connected: "Conectado",
    connecting: "...",
    disconnected: "Desconectado",
};

export default function InfoArea({ connectStatus = "disconnected" }) {
    const [lastConnData, setLastConnData] = useState({
        usingConnection: false,
        connectedDate: null,
        disconnectedDate: null,
        timingSeconds: null,
    });

    const { usingConnection } = lastConnData;

    useEffect(() => {
        const stopwatchElem = document.querySelector(".stop-watch");
        if (connectStatus === "connected") {
            stopWatch("start", { stopwatchElem });
            setLastConnData((prev) => ({
                ...prev,
                usingConnection: true,
                connectedDate: new Date(),
            }));
        }

        if (connectStatus === "disconnected" && usingConnection === true) {
            const stopWatchResult = stopWatch("reset", { stopwatchElem });

            setLastConnData((prev) => ({
                ...prev,
                usingConnection: false,
                disconnectedDate: stopWatchResult.disconnectedDate,
                timingSeconds: stopWatchResult.timingSeconds,
            }));
        }

        stopWatch("stop", { stopwatchElem });
    }, [connectStatus, usingConnection]);

    return (
        <Fragment>
            <hr className="lazer" />
            <section className="data">
                <div>
                    <p>
                        <span className="stop-watch">00:00:00</span>
                    </p>
                    <div>
                        <span>
                            <Alarm />
                        </span>
                        <p>Tempo Conexão</p>
                    </div>
                </div>
                <div>
                    <p className={`status txt-color-${connectStatus}`}>
                        <span>{statusStore[connectStatus]}</span>
                    </p>
                </div>
                <div>
                    <p>
                        <span className="data-num">5</span>mb{" "}
                        {/*condition to either mb or gb */}
                    </p>
                    <div>
                        <span>
                            <Flash />
                        </span>
                        <p>Dados Trafegados</p>
                    </div>
                </div>
            </section>
            <div style={{ marginBottom: 50 }} />
            <style jsx>
                {`
                    .info-area .lazer {
                        position: relative;
                        top: -25px;
                        margin: 0 0 10px 0;
                        width: 100%;
                        border: 0;
                        height: 2px;
                        background-image: linear-gradient(
                            to right,
                            rgba(0, 0, 0, 0),
                            rgba(34, 202, 165, 0.75),
                            rgba(0, 0, 0, 0)
                        );
                    }

                    .data {
                        position: relative;
                        top: -15px;
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                    }

                    .data div p {
                        color: #fff;
                        margin: 0;
                        font-size: 11px;
                        font-weight: bold;
                        font-family: var(--mainFont);
                    }

                    .data div p.status {
                        position: relative;
                        top: -15px;
                        left: 10px;
                        margin-right: 0;
                        font-size: 19px;
                    }

                    .data div p span.data-num {
                        margin-right: 5px;
                    }

                    .data div p span,
                    data div p.status {
                        display: inline-block;
                        text-align: center;
                        font-size: 18px;
                    }

                    .data div p,
                    data div div p {
                        text-align: center;
                    }

                    .data div div {
                        display: flex;
                        align-items: center;
                    }

                    .data div div span {
                        color: rgb(34, 202, 165);
                    }

                    .data div div p {
                        margin: 0;
                        color: #657379;
                    }

                    .data div div p {
                        font-size: 10px;
                    }
                `}
            </style>
        </Fragment>
    );
}
