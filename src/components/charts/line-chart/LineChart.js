import { useEffect } from "react";
import Chartist from "chartist";
import "chartist-plugin-tooltips";
import getIncreasedPerc from "../../../utils/numbers/getIncreasedPerc";
import "./_LineChart.scss";
import pluginPointLabels from "../plugins/pluginPointLabels";
import convertToReal from "../../../utils/numbers/convertToReal";
import getArrayAvg from "../../../utils/arrays/getArrayAvg";

pluginPointLabels(Chartist);

const isSmall = window.Helper.isSmallScreen();

const getPlugins = ({ axisYTitle, isMoneyData, signBeforeData }) => {
    const func = handleDataFormat({ isMoneyData, signBeforeData });

    return {
        plugins: [
            Chartist.plugins.ctPointLabels({
                textAnchor: "middle",
                labelInterpolationFnc: func,
            }),
            Chartist.plugins.tooltip({
                transformTooltipTextFnc(value) {
                    return `${isMoneyData ? "R$" : ""} ${value} ${
                        axisYTitle === undefined ? "" : axisYTitle
                    }`;
                },
            }),
        ],
    };
};

const getOptions = ({
    lowestValue,
    highestValue,
    axisYTitle,
    isMoneyData,
    signBeforeData,
}) => ({
    low: lowestValue,
    high: highestValue,
    showGridBackground: false,
    showArea: true,
    lineSmooth: true,
    height: "250px",
    axisX: {
        showGrid: true,
    },
    axisY: {
        showGrid: false,
    },
    chartPadding: {
        top: 25,
        right: 0,
        bottom: 20,
        left: isMoneyData ? 18 : 0, // it gives more spacing to put more digits
    },
    ...getPlugins({ axisYTitle, isMoneyData, signBeforeData }),
});

// dataArray should have elements as numbers
// data examples:
// xLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
// dataArray = [0, 100, 1, 40, -30, 20, 90]
export default function LineChart({
    xLabels,
    dataArray,
    title,
    highestValue, // number
    lowestValue, // number
    axisYTitle, // string
    isMoneyData = false,
    signBeforeData = "",
    textAfterData = "",
    onlySmall = false, // useful especially when used in a modal when the width is limited regardless of the screen width size.
    isFirstPos = false, // handle extreme left data visulization
    isLastPos = false,
}) {
    const arrLen = dataArray && dataArray.length;

    const lastValue = arrLen >= 1 && dataArray.slice(-1)[0];
    const lastButOne = arrLen >= 2 && dataArray.slice(-2)[0];

    let lastDiff;
    let lastPerc;

    if (!Number.isNaN(lastValue) && !Number.isNaN(lastButOne)) {
        lastDiff = lastValue - lastButOne;
        lastPerc = Math.round(getIncreasedPerc(lastButOne, lastValue));
    }

    const isNegative = lastPerc < 0;
    const showText = !Number.isNaN(lastButOne) && lastPerc !== 0;

    const handleLastDiff = (val, options = {}) => {
        const { isDiff } = options;
        if (isMoneyData) {
            const mainMoneyCond = val ? `R$${convertToReal(val)}` : "R$...";
            return isDiff ? `(R$${convertToReal(val)})` : mainMoneyCond;
        }

        return isDiff ? `(${val}${textAfterData})` : `${val}${textAfterData}`;
    };

    useEffect(() => {
        (async () => {
            const chart = new Chartist.Line(
                ".line-chart",
                {
                    labels: xLabels,
                    series: [dataArray],
                },
                getOptions({
                    highestValue,
                    lowestValue,
                    axisYTitle,
                    isMoneyData,
                    signBeforeData,
                })
            );

            chart.on("draw", (data) => {
                if (data.type === "line" || data.type === "area") {
                    data.element.animate({
                        d: {
                            begin: 2000 * data.index,
                            dur: 2000,
                            from: data.path
                                .clone()
                                .scale(1, 0)
                                .translate(0, data.chartRect.height())
                                .stringify(),
                            to: data.path.clone().stringify(),
                            easing: Chartist.Svg.Easing.easeOutQuint,
                        },
                    });
                }
            });
            setTimeout(() => {
                const lastData = document.querySelector(
                    "svg.ct-chart-line .ct-series text:last-of-type"
                );

                const parentElem = lastData && lastData.parentNode;
                const lastXAttrib =
                    lastData && lastData.x && lastData.x.baseVal["0"].value;
                const lastYAttrib =
                    lastData && lastData.y && lastData.y.baseVal["0"].value;
                if (lastData) {
                    lastData.innerHTML = isFirstPos
                        ? ""
                        : handleLastDiff(lastValue); // values in first position in the yAxis is too close to yLabels, that's why omitting it.
                }

                const { distanceY, distanceX } = handleDiffLabelDistance({
                    lastValue,
                    onlySmall,
                    isLastPos,
                    dataArray,
                });

                const textObj = {
                    props: {
                        x: lastXAttrib - distanceX,
                        y: lastYAttrib + distanceY,
                        "text-anchor": "middle",
                    },
                    txtContent: null,
                    style: `fill: ${
                        isNegative ? "#fc8b95" : "var(--lightGreen)"
                    }; font-size: ${isSmall ? "18" : "22"}px;`,
                    multilineText: showText && [
                        isNegative ? `${lastPerc}%` : `+${lastPerc}%`,
                        handleLastDiff(lastDiff, { isDiff: true }),
                    ],
                };
                if (!isFirstPos && dataArray.length) {
                    drawText(textObj, parentElem);
                }
            }, 3000);
        })();
        // return () => clearTimeout(timer)
    }, [dataArray, lastValue, lastButOne, lastDiff, lastPerc, isFirstPos]);

    return (
        <section className="line-chart--root">
            <h2 className="py-3 text-normal font-weight-bold text-white text-center">
                {title}
            </h2>
            <div className="line-chart" />
        </section>
    );
}

// https://stackoverflow.com/questions/54081437/how-to-dynamically-create-svg-text-elements-using-js
function handleSVGMultiline({ svgParent, textArray, xDistance }) {
    textArray.map((txt, ind) => {
        const tspan = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "tspan"
        );
        tspan.setAttribute("x", xDistance);
        tspan.setAttribute("dy", "1.2em");
        tspan.textContent = txt;
        if (ind === 1) {
            tspan.style = "fill: rgb(103, 137, 162); font-size: 15px;";
        }
        svgParent.appendChild(tspan);
    });

    return svgParent;
}
function drawText(o, parent) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

    for (const name in o.props) {
        if (o.props.hasOwnProperty(name)) {
            text.setAttributeNS(null, name, o.props[name]);
        }
    }

    text.style = o.style;
    text.classList.add("ct-label");

    if (o.multilineText) {
        const opts = {
            svgParent: text,
            textArray: o.multilineText,
            xDistance: o.props.x,
        };
        const newTextElem = handleSVGMultiline(opts);
        return parent.appendChild(newTextElem);
    }

    text.textContent = o.txtContent;
    parent.appendChild(text);

    return text;
}

function handleDiffLabelDistance({
    lastValue,
    onlySmall,
    isLastPos,
    dataArray,
}) {
    // if the value is the heighest
    const handleUpperDiff = () => {
        const isLastMaxValue = Math.max(...dataArray) === lastValue;
        const isLastMinValue = Math.min(...dataArray) === lastValue;

        if (isLastMaxValue) return false;
        if (isLastMinValue) return true;

        const avg = getArrayAvg(dataArray);
        return lastValue < avg; // ? true : false
    };

    const needUpperDiff = handleUpperDiff();
    let distanceY;
    let distanceX;

    if (isSmall || onlySmall) {
        distanceY = needUpperDiff ? -85 : 55;
    } else {
        distanceY = needUpperDiff ? -70 : 40;
    }

    if (isSmall || onlySmall) {
        if (isLastPos) {
            distanceX = -5;
        } else {
            distanceX = -25;
        }
    } else {
        distanceX = 65;
    }

    return {
        distanceY,
        distanceX,
    };
}

function handleDataFormat({ isMoneyData = false, signBeforeData }) {
    if (isMoneyData) {
        const getValue = (value) =>
            Number.isInteger(value) ? value : value.toFixed(1);
        return (value) =>
            `R$${!value && value !== 0 ? "..." : getValue(value)}`;
    }

    if (signBeforeData) {
        return (value) => {
            if (!value && value !== 0) return "...";
            return signBeforeData + value;
        };
    }

    return "...";
}
// END HELPERS

// const isSmall = window.Helper.isSmallScreen();

// const options = {
//   // Options for X-Axis
//   axisX: {
//     // The offset of the labels to the chart area
//     offset: 30,
//     // Position where labels are placed. Can be set to `start` or `end` where `start` is equivalent to left or top on vertical axis and `end` is equivalent to right or bottom on horizontal axis.
//     position: 'end',
//     // Allows you to correct label positioning on this axis by positive or negative x and y offset.
//     labelOffset: {
//       x: 0,
//       y: 0
//     },
//     // If labels should be shown or not
//     showLabel: true,
//     // If the axis grid should be drawn or not
//     showGrid: false, // true
//     // Interpolation function that allows you to intercept the value from the axis label
//     labelInterpolationFnc: Chartist.noop,
//     // Set the axis type to be used to project values on this axis. If not defined, Chartist.StepAxis will be used for the X-Axis, where the ticks option will be set to the labels in the data and the stretch option will be set to the global fullWidth option. This type can be changed to any axis constructor available (e.g. Chartist.FixedScaleAxis), where all axis options should be present here.
//     type: undefined
//   },
//   // Options for Y-Axis
//   axisY: {
//     // The offset of the labels to the chart area
//     offset: 40,
//     // Position where labels are placed. Can be set to `start` or `end` where `start` is equivalent to left or top on vertical axis and `end` is equivalent to right or bottom on horizontal axis.
//     position: 'start',
//     // Allows you to correct label positioning on this axis by positive or negative x and y offset.
//     labelOffset: {
//       x: 0,
//       y: 0
//     },
//     // If labels should be shown or not
//     showLabel: true,
//     // If the axis grid should be drawn or not
//     showGrid: true,
//     // Interpolation function that allows you to intercept the value from the axis label
//     labelInterpolationFnc: Chartist.noop,
//     // Set the axis type to be used to project values on this axis. If not defined, Chartist.AutoScaleAxis will be used for the Y-Axis, where the high and low options will be set to the global high and low options. This type can be changed to any axis constructor available (e.g. Chartist.FixedScaleAxis), where all axis options should be present here.
//     type: undefined,
//     // This value specifies the minimum height in pixel of the scale steps
//     scaleMinSpace: 20,
//     // Use only integer values (whole numbers) for the scale steps
//     onlyInteger: false
//   },
//   // Specify a fixed width for the chart as a string (i.e. '100px' or '50%')
//   width: undefined,
//   // Specify a fixed height for the chart as a string (i.e. '100px' or '50%')
//   height: undefined,
//   // If the line should be drawn or not
//   showLine: true,
//   // If dots should be drawn or not
//   showPoint: true,
//   // If the line chart should draw an area
//   showArea: true,
//   // The base for the area chart that will be used to close the area shape (is normally 0)
//   areaBase: 0,
//   // Specify if the lines should be smoothed. This value can be true or false where true will result in smoothing using the default smoothing interpolation function Chartist.Interpolation.cardinal and false results in Chartist.Interpolation.none. You can also choose other smoothing / interpolation functions available in the Chartist.Interpolation module, or write your own interpolation function. Check the examples for a brief description.
//   lineSmooth: false, // true
//   // If the line chart should add a background fill to the .ct-grids group.
//   showGridBackground: false, //
//   // Overriding the natural low of the chart allows you to zoom in or limit the charts lowest displayed value
//   low: undefined,
//   // Overriding the natural high of the chart allows you to zoom in or limit the charts highest displayed value
//   high: undefined,
//   // Padding of the chart drawing area to the container element and labels as a number or padding object {top: 5, right: 5, bottom: 5, left: 5}
//   chartPadding: {
//     top: 15,
//     right: 15,
//     bottom: 5,
//     left: 10
//   },
//   // When set to true, the last grid line on the x-axis is not drawn and the chart elements will expand to the full available width of the chart. For the last label to be drawn correctly you might need to add chart padding or offset the last label with a draw event handler.
//   fullWidth: false,
//   // If true the whole data is reversed including labels, the series order as well as the whole series data arrays.
//   reverseData: false,
//   // Override the class names that get used to generate the SVG structure of the chart
//   classNames: {
//     chart: 'ct-chart-line',
//     label: 'ct-label',
//     labelGroup: 'ct-labels',
//     series: 'ct-series',
//     line: 'ct-line',
//     point: 'ct-point',
//     area: 'ct-area',
//     grid: 'ct-grid',
//     gridGroup: 'ct-grids',
//     gridBackground: 'ct-grid-background',
//     vertical: 'ct-vertical',
//     horizontal: 'ct-horizontal',
//     start: 'ct-start',
//     end: 'ct-end'
//   }
// };
