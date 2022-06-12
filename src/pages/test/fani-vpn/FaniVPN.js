import { Fragment, useEffect } from "react";
import MagicNavMenuIndicator from "pages/test/ref-codes/online-tut/magic-nav-menu-indicator/MagicNavMenuIndicator.js";
import SwitchBtn from "components/buttons/material-ui/SwitchBtn";
import GaugeMeasuringData from "./GaugeMeasuringData";
import TopNav from "./TopNav.js";
import HelpConectionBtn from "./components/buttons/HelpConectionBtn.js";

/* IMPORTANT NOTES/LINKS
repo: https://github.com/luisFebro/febront
CTA hover effect: https://codepen.io/avvign/pen/NVJzQW
*/

const statusStore = {
    connected: "Conectado",
    connecting: "Connectando...",
    disconnected: "Desconectado",
};

export default function FaniVPN() {
    const currStatus = "connected";

    const showSwitcher = () => {
        return (
            <SwitchBtn
                titleLeft="Conexão 1" // when selected, should be "v2ray"
                titleRight="Conexão 2" // when selected, should be "vchannel"
                defaultStatus
                customColor="text-green text-small font-fani"
                thisSColor="green"
                needSameColor
                animationOn
                needCustomColor
                callback={() => null}
            />
        );
    };

    const InfoArea = () => (
        <section className="info-area">
            <hr className="lazer" />
            <section className="data">
                <div>
                    <p>
                        <span>00:30:25</span>
                    </p>
                    <div>
                        <span>
                            <ion-icon name="alarm-outline"></ion-icon>
                        </span>
                        <p>Tempo Conexão</p>
                    </div>
                </div>
                <div>
                    <p className={`status ${currStatus}`}>
                        <span>{statusStore[currStatus]}</span>
                    </p>
                </div>
                <div>
                    <p>
                        <span className="data-num">5</span>mb{" "}
                        {/*condition to either mb or gb */}
                    </p>
                    <div>
                        <span>
                            <ion-icon name="flash"></ion-icon>
                        </span>
                        <p>Dados Trafegados</p>
                    </div>
                </div>
            </section>
            <div style={{ marginBottom: 250 }} />
            <style jsx>
                {`
                    .info-area {
                        position: relative;
                    }

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
                        font-family: var(--faniFont);
                    }

                    .data div p.status {
                        margin-right: 0;
                        font-size: 19px;
                    }

                    .data div p.status.connected {
                        color: #1cf499;
                    }

                    .data div p.status.connecting {
                        color: #e1d509;
                    }

                    .data div p.status.disconnected {
                        color: #ee8888;
                    }

                    .data div p span.data-num {
                        margin-right: 5px;
                    }

                    .data div p span,
                    data div p.status {
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
        </section>
    );

    useEffect(() => {
        const script1 = document.createElement("script");
        script1.type = "module";
        script1.src =
            "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js";

        const script2 = document.createElement("script");
        script2.nomodule = true;
        script2.src =
            "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js";

        document.body.appendChild(script1);
        document.body.appendChild(script2);

        console.log("IonIcons started");

        return () => {
            // document.body.removeChild(script1);
            // document.body.removeChild(script2);
        };
    }, []);

    return (
        <Fragment>
            <section className="main-gauge-area">
                <TopNav />
                <div className="container-center my-3">{showSwitcher()}</div>
                <hr className="lazer-gauge" />
                <GaugeMeasuringData />
                <div
                    style={{
                        marginBottom: 60,
                    }}
                />
            </section>
            <div className="help-area">
                <HelpConectionBtn />
            </div>
            <InfoArea />
            <MagicNavMenuIndicator />
            <div className="space-bottom" />
            <style jsx>
                {`
                    .main-gauge-area .lazer-gauge {
                        position: relative;
                        margin: 80px 0 40px 0;
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

                    .main-gauge-area {
                        border-bottom-left-radius: 60px;
                        border-bottom-right-radius: 60px;
                        background-image: linear-gradient(
                            to left bottom,
                            #002d2a,
                            #002628,
                            #011f24,
                            #02191e,
                            #001118
                        );
                        border: solid 2px #043228;
                    }

                    .space-bottom {
                        margin-bottom: 100px;
                    }

                    .help-area {
                        position: relative;
                        display: flex;
                        justify-content: right;
                    }
                `}
            </style>
        </Fragment>
    );
}

/* ARCHIVES
<div>
    <span>
        <ion-icon name="share-social"></ion-icon>
    </span>
    <p>Ping ms</p>
</div>
 */
