import { Fragment, useEffect } from "react";
import MagicNavMenuIndicator from "pages/test/ref-codes/online-tut/magic-nav-menu-indicator/MagicNavMenuIndicator.js";
import SwitchBtn from "components/buttons/material-ui/SwitchBtn";
import TopNav from "./TopNav.js";
import CTA from "./CTA.js";

/* IMPORTANT NOTES/LINKS
repo: https://github.com/luisFebro/febront
CTA hover effect: https://codepen.io/avvign/pen/NVJzQW
*/

export default function FaniVPN() {
    const showSwitcher = () => {
        return (
            <SwitchBtn
                titleLeft="Conexão 1" // when selected, should be "v2ray"
                titleRight="Conexão 2" // when selected, should be "vchannel"
                defaultStatus
                customColor="text-green text-small"
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
                        <span>201</span>ms
                    </p>
                    <div>
                        <span>
                            <ion-icon name="pencil"></ion-icon>
                        </span>
                        <p>Tempo Conexão</p>
                    </div>
                </div>
                <div>
                    <p className="status">Ordinary</p>
                    <div>
                        <span>
                            <ion-icon name="share-social"></ion-icon>
                        </span>
                        <p>Network Quality</p>
                    </div>
                </div>
                <div>
                    <p>
                        <span>45</span>%
                    </p>
                    <div>
                        <span>
                            <ion-icon name="flash"></ion-icon>
                        </span>
                        <p>Dados Trafegados</p>
                    </div>
                </div>
            </section>
            <style jsx>
                {`
                    @import url("https://fonts.googleapis.com/css2?family=Kdam+Thmor+Pro&display=swap");

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
                        font-family: "Kdam Thmor Pro", sans-serif;
                    }

                    .data div p.status {
                        margin-right: 0;
                        font-size: 19px;
                        color: #1cf499;
                    }

                    .data div p span {
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

                    .data div div p,
                    data div div span {
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
            </section>
            <div className="cta-area">
                <CTA />
            </div>
            <InfoArea />
            <MagicNavMenuIndicator />
            <div className="space-bottom" />
            <style jsx>
                {`
                    .main-gauge-area {
                        min-height: 330px;
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

                    .cta-area {
                        position: relative;
                        display: flex;
                        justify-content: center;
                    }
                `}
            </style>
        </Fragment>
    );
}
