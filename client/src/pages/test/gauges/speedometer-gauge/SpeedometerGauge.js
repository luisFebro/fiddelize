import React, { useEffect, Fragment } from "react";
import Chartist from "chartist";
import repeat from "../../../../utils/arrays/repeat";

const isSmall = window.Helper.isSmallScreen();

// HELPERS
const getBadZoneList = (value) => {
    const lastDeg = -95;
    const lastValue = -100;

    const valueToDegList = {};

    valueToDegList[`${lastValue}`] = lastDeg;
    repeat(99).forEach((a, i) => {
        const currOrder = i + 1;
        valueToDegList[`${lastValue + currOrder}`] =
            lastDeg + (currOrder - 2.5);
    });

    const finalValue = valueToDegList[value];
    if (finalValue <= -95) return -95;
    return Math.floor(finalValue - 10);
};

const getOkZoneList = (value) => {
    const lastDeg = 90;
    const lastValue = 100;

    const valueToDegList = {};

    valueToDegList[`${lastValue}`] = lastDeg;
    repeat(99).forEach((a, i) => {
        const currOrder = i + 1;
        valueToDegList[`${lastValue - currOrder}`] =
            lastDeg - (currOrder - 2.5);
    });

    const finalValue = valueToDegList[value];
    if (finalValue > 95) return 90;
    return Math.floor(finalValue);
};

const getStatus = (value) => {
    if (value < 0) return "Ruim";
    if (value >= 0 && value < 30) return "Bom";
    if (value >= 30 && value < 70) return "Ótimo";
    if (value >= 70 && value <= 100) return "Excelente";
};

const getBadOrGoodStatus = (value) => {
    if (value < 0) return "bad";
    if (value >= 0) return "good";
};

const convertValueToDeg = (value) => {
    if (value === 0) return 0;
    if (value === undefined) return -90;

    const status = getBadOrGoodStatus(value);
    if (status === "bad") {
        return getBadZoneList(value);
    }
    return getOkZoneList(value);
};
// END HELPERS

export default function SpeedometerGauge({
    value = 100,
    color = "var(--mainRed)",
}) {
    useEffect(() => {
        const options = {
            donut: true,
            donutWidth: 50,
            donutSolid: true,
            startAngle: 270,
            total: 430,
            showLabel: true,
            labelOffset: 0,
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
            <h2
                className="speedometer-text-result text-center"
                style={{ color }}
            >
                {getStatus(value)}
            </h2>
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

// @keyframes move {
//      0% {
//          transform:rotate(-90deg);
//      }
//      50% {
//          transform:rotate(90deg);
//      }
//      100% {
//          transform:rotate(-90deg);
//      }
// }
/*
<div className="ct-chart-line"></div>
 */
