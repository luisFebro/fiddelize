import { useEffect, useState } from "react";
import Alarm from "styles/icons/ion/Alarm";
import Navbar from "../comps/Navbar";

export default function LogsContent() {
    const [currLog, setCurrLog] = useState(1);
    const now = new Date();

    useEffect(() => {
        const totalLogs = 3;
        // if(currLog > totalLogs) return;
        const thisDocLog = document.querySelector(`.log-line${currLog}`);
        setTimeout(() => {
            if (thisDocLog) thisDocLog.classList.add("d-inline-block");
        }, 3000);
        setCurrLog((prev) => (prev += 1));
    }, [currLog]);

    return (
        <section>
            <Navbar title="Registros" />
            <section className="logs-area">
                <div className="animated zoomIn log-line log-line1 d-none d-block">
                    <span className="hour">
                        {now.getHours()}:{now.getMinutes()}:{now.getSeconds()}
                    </span>
                    <span className="text">
                        Versão do Aplicativo: Correção Proxy T Build 701
                    </span>
                </div>
                <div className="log-line log-line2 d-none">
                    <span className="hour">
                        {now.getHours()}:{now.getMinutes()}:{now.getSeconds()}
                    </span>
                    <span className="text">
                        Versão do Aplicativo: Correção Proxy T Build 701
                    </span>
                </div>
                <div className="log-line log-line3 d-none">
                    <span className="hour">
                        {now.getHours()}:{now.getMinutes()}:{now.getSeconds()}
                    </span>
                    <span className="text service">Iniciado serviço</span>
                </div>
                <div className="log-line log-line4 d-none">
                    <span className="hour">
                        {now.getHours()}:{now.getMinutes()}:{now.getSeconds()}
                    </span>
                    <span className="text">Conectando...</span>
                </div>
                <div className="log-line log-line5 d-none">
                    <span className="hour">
                        {now.getHours()}:{now.getMinutes()}:{now.getSeconds()}
                    </span>
                    <span className="text">Estabelecendo conexão...</span>
                </div>
                <div className="log-line log-line6 d-none">
                    <span className="hour">
                        {now.getHours()}:{now.getMinutes()}:{now.getSeconds()}
                    </span>
                    <span className="text">Injetando...</span>
                </div>
                <div className="log-line log-line7 d-none">
                    <span className="hour">
                        {now.getHours()}:{now.getMinutes()}:{now.getSeconds()}
                    </span>
                    <span className="text">
                        Finger Print:
                        4d:df:1f:0b:7b:13:69:2c:89:8a:c8:d1:95:16:68:e5
                    </span>
                </div>
                <div className="log-line log-line7 d-none">
                    <span className="hour">
                        {now.getHours()}:{now.getMinutes()}:{now.getSeconds()}
                    </span>
                    <span className="text success">Sua VPN foi conectada!</span>
                </div>
            </section>
            <style jsx>
                {`
                    .logs-area {
                        overflow: visible;
                        position: relative;
                    }

                    .logs-area .time-icon {
                        z-index: 100;

                        font-size: 35px;
                        top: -20px;
                        left: 20px;
                        position: absolute;
                        color: var(--connected);
                    }

                    .log-line {
                        display: flex;
                        overflow: visible;
                        width: 100%;
                    }
                    .log-line .hour {
                        color: #2ecc71;
                        text-align: center;
                        jsutify-content: center;
                        font-weight: bold;
                        background: linear-gradient(
                            to right,
                            #0f0c29,
                            #302b63,
                            #24243e
                        );
                    }

                    .log-line span {
                        font-family: var(--mainFont);
                        display: flex;
                        align-items: center;
                        padding: 5px 15px;
                        color: var(--mainWhite);
                        border-bottom: 0.02px solid var(--mainWhite);
                    }

                    .log-line .text {
                        padding-right: 10px;
                        width: 100%;
                        color: var(--txtColorDarkLight);
                    }

                    .log-line .text.service {
                        font-weight: bold;
                    }

                    .log-line .text.service {
                        color: var(--connected);
                    }
                `}
            </style>
        </section>
    );
}

/*
 Archive

  <span className="time-icon">
                    <Alarm />
                </span>
 */
