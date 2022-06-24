// version 0.91.2
import useScrollUp from "hooks/scroll/useScrollUp";
import { Fragment, useState, useEffect } from "react";
import SwitchBtn from "components/buttons/material-ui/SwitchBtn";
// import { useGlobalContext } from "context";
import useBackColor from "hooks/useBackColor";
import MagicNavMenuIndicator from "components/_layout/navbar/magic-nav-menu-indicator/MagicNavMenuIndicator.js";
import GaugeMeasuringData from "./comps/GaugeMeasuringData";
import TopNav from "./comps/TopNav";
import HelpConnectionBtn from "./comps/HelpConnectionBtn";
import MainBtn from "./comps/main-btn/MainBtn";
import InfoArea from "./comps/InfoArea";
import PopupAd from "./popup-ad/PopupAd";

export default function MaricaTelecom() {
    useBackColor("var(--themeBackground)");
    useScrollUp();
    // const { connectStatus } = useGlobalContext();
    // TEMP FOR TESTING
    const [connectStatus, setConnectStatus] = useState("disconnected");
    const [connect, setConnect] = useState(false);
    const isDisconnecting = connectStatus === "connected";

    // trigger popup ad
    const [popupOpen, setPopupOpen] = useState(false);

    useEffect(() => {
        const waitSeconds = 5000;
        setTimeout(() => {
            // setPopupOpen(true)
        }, waitSeconds);
    }, []);
    // end trigger popup ad

    const showSwitcher = () => {
        return (
            <SwitchBtn
                titleLeft="Conexão 1" // when selected, should be "v2ray"
                titleRight="Conexão 2" // when selected, should be "vchannel"
                defaultStatus
                customColor="text-green text-small main-font"
                thisSColor="green"
                needSameColor
                animationOn
                needCustomColor
                callback={() => null}
            />
        );
    };

    return (
        <Fragment>
            <section className="main-gauge-area">
                <TopNav />
                <div className="container-center switcher-area">
                    {showSwitcher()}
                </div>
                <MainBtn
                    connectStatus={connectStatus}
                    setConnectStatus={setConnectStatus}
                    connect={connect}
                    setConnect={setConnect}
                    isDisconnecting={isDisconnecting}
                />
                <div className="gauge-measuring-data-area">
                    <GaugeMeasuringData />
                </div>
                <div
                    style={{
                        marginBottom: 60,
                    }}
                />
            </section>
            <div className="help-area">
                <HelpConnectionBtn />
            </div>
            <div className="info-area">
                <InfoArea connectStatus={connectStatus} />
            </div>
            <MagicNavMenuIndicator />
            <div className="space-bottom" />
            <PopupAd setPopupOpen={setPopupOpen} popupOpen={popupOpen} />
            <style jsx>
                {`
                    .switcher-area {
                        position: relative;
                        top: -9px;
                        z-index: 100;
                        margin-top: 1.8rem !important;
                        margin-bottom: 0.4rem !important;
                    }

                    .main-gauge-area {
                        position: relative;
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

                    .gauge-measuring-data-area {
                        margin: 55px 0 30px 0;
                    }

                    .help-area {
                        position: relative;
                        display: flex;
                        justify-content: right;
                    }

                    .info-area {
                        position: relative;
                    }
                `}
            </style>
        </Fragment>
    );
}

/* ARCHIVES

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

 */
