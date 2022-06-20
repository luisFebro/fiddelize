import { Fragment, useState, useEffect } from "react";
import Bubble from "./elems/Bubble";
import GaugeArch from "./elems/gauge-arch/GaugeArch";

export default function MainBtn({
    connectStatus = "disconnected",
    setConnectStatus,
    connect,
    setConnect,
    isDisconnecting,
}) {
    const [btnTitle, setBtnTitle] = useState("CONECTAR");
    const [btnColor, setBtnColor] = useState("var(--btnColor)");

    const isConnecting = connectStatus === "connecting";

    const changeBtnStatus = (status) => {
        const isDisconnected =
            connectStatus === "disconnected" || connect === false;

        // before making http request
        setConnectStatus("connecting");
        setBtnTitle(isDisconnecting ? "Desconectando..." : "Conectando...");
        setBtnColor("grey");

        setTimeout(() => {
            if (isDisconnected) {
                // after receive http request, connect user with global provider

                // change connection status to opposite
                setConnectStatus("connected");
                setConnect(true);

                // the opposite btn to switch status
                setBtnTitle("DESCONECTAR");
                setBtnColor("var(--btnRed)");
            }

            if (status === "connected" || connect === true) {
                // change connection status to opposite
                setConnectStatus("disconnected");
                setConnect(false);

                // the opposite btn to switch status
                setBtnTitle("CONECTAR");
                setBtnColor("var(--btnColor)");
            }
        }, 6000);
    };

    useEffect(() => {
        if (!connectStatus) return null;
    }, []);

    const handleConnectBtn = () => {
        changeBtnStatus(connectStatus);
    };

    const ConnectBtn = () => (
        <Fragment>
            <a
                href="#"
                className={`main-connect-btn ${
                    isConnecting ? "disabled-link" : ""
                }`}
                onClick={handleConnectBtn}
            >
                {btnTitle}
            </a>
            <style jsx>
                {`
                    .main-connect-btn {
                        background: ${btnColor};
                    }
                `}
            </style>
            <style jsx>
                {`
                    .main-connect-btn {
                        cursor: pointer;
                        position: relative;
                        text-align: center;
                        font-size: 15px;
                        font-weight: 500;
                        color: #fff;
                        text-decoration: none !important;
                        z-index: 100;
                        overflow: hidden;
                        padding: 4px 16px;
                        text-shadow: 1px 1px 3px black;
                        display: inline-block;
                        border-radius: 100px;
                    }
                `}
            </style>
        </Fragment>
    );

    const showLightning = () => (
        <section
            className={connectStatus === "connected" ? "d-block" : "d-none"}
        >
            <div className="light light3 animated fadeIn delay-1s">
                <img
                    witdh={55}
                    height={55}
                    src="img/febront/lightning.png"
                    alt=""
                />
            </div>
            <div className="light light4 animated fadeIn delay-2s">
                <img
                    witdh={55}
                    height={55}
                    src="img/febront/lightning.png"
                    alt=""
                />
            </div>
            <div className="light light5 animated fadeIn delay-3s">
                <img
                    witdh={55}
                    height={55}
                    src="img/febront/lightning.png"
                    alt=""
                />
            </div>
            <div className="light light6 animated fadeIn delay-4s">
                <img
                    witdh={55}
                    height={55}
                    src="img/febront/lightning.png"
                    alt=""
                />
            </div>
        </section>
    );

    return (
        <section className="main-btn--root">
            <div className="core-bubble--root">
                <Bubble connectStatus={connectStatus} />
                <div className="gauge-arch--root">
                    <GaugeArch
                        connectStatus={connectStatus}
                        setConnectStatus={setConnectStatus}
                    />
                </div>
                <div className="logo">
                    <img
                        height={50}
                        src={`img/febront/${connectStatus}.png`}
                        alt=""
                    />
                </div>
                {showLightning()}
                <div className="connect-btn-area">
                    <ConnectBtn />
                </div>
            </div>
            <style jsx>
                {`
                    .main-btn--root {
                        padding: 25px 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .core-bubble--root {
                        position: relative;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        max-width: 150px;
                    }

                    .gauge-arch--root {
                        position: absolute;
                    }

                    .core-bubble--root .logo,
                    .core-bubble--root .light {
                        position: absolute;
                    }

                    .core-bubble--root .logo {
                        top: 75px;
                    }

                    .core-bubble--root .light3 {
                        bottom: -6px;
                        right: -15px;
                        transform: rotate(200deg);
                    }

                    .core-bubble--root .light4 {
                        bottom: -11px;
                        left: -15px;
                        transform: rotate(-210deg);
                    }

                    .core-bubble--root .light5 {
                        top: 39px;
                        left: -12px;
                        transform: rotate(200deg);
                    }

                    .core-bubble--root .light6 {
                        top: 44px;
                        right: -10px;
                        transform: rotate(-210deg);
                    }

                    .connect-btn-area {
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        z-index: 100;
                        bottom: -39%;
                    }
                `}
            </style>
        </section>
    );
}
