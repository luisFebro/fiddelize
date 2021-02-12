import React, { useEffect, Fragment, useState } from "react";
import Chartist from "chartist";
import {
    getBadZoneList,
    getOkZoneList,
    getTextStatus,
    convertValueToDeg,
} from "./helpers";
import "./_SpeedometerGauge.scss";
import colorsHandler from "../../../pages/dashboard-client-admin/dash-clients/clients-reviews/helpers/colorsHandler";
import Dialog from "@material-ui/core/Dialog";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";

const isSmall = window.Helper.isSmallScreen();

export default function SpeedometerGauge({ value }) {
    const [captionOn, setCaptionOn] = useState(false);
    const { colorNPS } = colorsHandler({ nps: value });

    useEffect(() => {
        const options = {
            donut: true,
            donutWidth: 50,
            donutSolid: true,
            startAngle: 270,
            total: 430,
            showLabel: true,
            labelOffset: 10,
        };

        (() => {
            new Chartist.Pie(
                ".ct-chart",
                {
                    labels: [" ", " ", "0-30", " ", "30-70", " ", "70-"],
                    series: [100, 5, 30, 5, 40, 5, 30],
                },
                options
            );
        })();
    }, []);

    const degSelected = convertValueToDeg(value);
    useKeyframeAnimateNeedle({ finalValue: degSelected });

    const { title: textStatus, advice } = getTextStatus(value);

    const showDialogCaption = () => (
        <Dialog
            PaperProps={{ style: { backgroundColor: "var(--mainWhite)" } }}
            style={{ zIndex: 10000 }}
            open={captionOn}
            aria-labelledby="form-dialog-title"
            className="animated slideInLeft faster"
        >
            <section className="speedometer-caption">
                <h2 className="my-3 text-subtitle font-weight-bold text-center text-purple">
                    Legenda
                </h2>
                <div>
                    <p
                        className="text-normal text-nowrap text-shadow mr-3 text-pill"
                        style={{ backgroundColor: "var(--mainRed)" }}
                    >
                        -100 a 0 pontos
                    </p>
                    <p className="text-normal font-weight-bold text-red">
                        Precisa Melhorias
                    </p>
                </div>
                <div>
                    <p
                        className="text-normal text-shadow mr-3 text-pill"
                        style={{ backgroundColor: "var(--niceUiYellow)" }}
                    >
                        0 a 30 pontos
                    </p>
                    <p className="text-normal font-weight-bold text-dark-yellow">
                        Bom
                    </p>
                </div>
                <div>
                    <p
                        className="text-normal text-shadow mr-3 text-pill"
                        style={{ backgroundColor: "var(--mainGreen)" }}
                    >
                        30 a 70 pontos
                    </p>
                    <p className="text-normal font-weight-bold text-alt-green">
                        Ótimo
                    </p>
                </div>
                <div>
                    <p
                        className="text-nowrap text-normal text-shadow mr-3 text-pill"
                        style={{ backgroundColor: "green" }}
                    >
                        70 a 100 pontos
                    </p>
                    <p className="text-normal font-weight-bold text-sys-green">
                        Excelente
                    </p>
                </div>
                <section className="container-center my-3">
                    <ButtonFab
                        title="fechar"
                        onClick={() => setCaptionOn(false)}
                        position="relative"
                        size="medium"
                        variant="extended"
                        backgroundColor="var(--themeSDark)"
                    />
                </section>
            </section>
        </Dialog>
    );

    const showCaptionBtn = () => (
        <ButtonFab
            title="legenda"
            onClick={() => setCaptionOn(true)}
            position="absolute"
            right={10}
            bottom={isSmall ? -45 : -100}
            variant="extended"
            size="small"
            backgroundColor="var(--themeSDark)"
        />
    );

    return (
        <Fragment>
            <section className="speedometer-gauge--root">
                <div
                    className={`ct-chart ${
                        isSmall ? "ct-minor-third" : "ct-major-third"
                    }`}
                ></div>
                <span className="speedometer-line"></span>
                <span
                    className="needle"
                    style={{
                        transform: `rotate(${degSelected}deg)`,
                    }}
                ></span>
                <span className="rect min-value">-100</span>
                <span className="rect max-value">100</span>
            </section>
            <h2 className={`${colorNPS} speedometer-text-result text-center`}>
                {textStatus}
                <p>{advice}</p>
            </h2>
            {captionOn ? showDialogCaption() : showCaptionBtn()}
        </Fragment>
    );
}

function useKeyframeAnimateNeedle({ finalValue }) {
    //reference: https://stackoverflow.com/questions/18481550/how-to-dynamically-create-keyframe-css-animations
    useEffect(() => {
        var style = document.createElement("style");
        style.type = "text/css";
        var keyFrames =
            "\
        @-webkit-keyframes move-needle {\
            0% {\
                transform: rotate(-90deg);\
            }\
        }\
        @-moz-keyframes spinIt {\
            100% {\
                transform: rotate(A_DYNAMIC_VALUE);\
            }\
        }";

        style.innerHTML = keyFrames.replace(/A_DYNAMIC_VALUE/g, finalValue);
        document.getElementsByTagName("head")[0].appendChild(style);
    }, []);
}
