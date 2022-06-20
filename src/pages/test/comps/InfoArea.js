import { Fragment } from "react";
import Flash from "styles/icons/ion/Flash";
import AlarmOutline from "styles/icons/ion/AlarmOutline";

const statusStore = {
    connected: "Conectado",
    connecting: "...",
    disconnected: "Desconectado",
};

const InfoArea = ({ connectStatus = "disconnected" }) => (
    <Fragment>
        <hr className="lazer" />
        <section className="data">
            <div>
                <p>
                    <span>00:30:25</span>
                </p>
                <div>
                    <span>
                        <AlarmOutline />
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

export default InfoArea;
