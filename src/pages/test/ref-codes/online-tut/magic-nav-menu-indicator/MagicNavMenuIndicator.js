import { Fragment, useEffect } from "react";
import TopNav from "./TopNav.js";
import BottomNav from "./BottomNav.js";
import CTA from "./CTA.js";

export default function MagicNavMenuIndicator() {
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

    const showInfoArea = () => (
        <section className="info-area">
            <style jsx>
                {`
                    .info-area {
                        position: relative;
                    }
                `}
            </style>
        </section>
    );

    return (
        <Fragment>
            <section className="main-gauge-area">
                <TopNav />
                <div className="cta-area">
                    <CTA />
                    <style jsx>
                        {`
                            .cta-area {
                                position: absolute;
                                width: 170px;
                                left: 50%;
                                transform: translateX(-50%);
                                bottom: 20%;
                                z-index: 10000;
                            }
                        `}
                    </style>
                </div>
            </section>
            {showInfoArea}
            <BottomNav />
            <style jsx>
                {`
                    .main-gauge-area {
                        min-height: 360px;
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
                    }
                `}
            </style>
        </Fragment>
    );
}

/*



 */
