import { useEffect } from "react";
import Chartist from "chartist";
import "./_BarChart.scss";
import "chartist-plugin-tooltips";
import pluginLabelModified from "./pluginLabelModified";

pluginLabelModified(null, null, Chartist);
// const isSmall = window.Helper.isSmallScreen();

const plugins = {
    plugins: [
        Chartist.plugins.ctPointLabels({
            textAnchor: "middle", // get it horizontal-wise middle of the bar
            labelOffset: { x: 0, y: -10 }, // adding a little offset to get some space
        }),
        Chartist.plugins.tooltip({
            transformTooltipTextFnc(value) {
                return `${value} clientes`;
            },
        }),
    ],
};

const options = {
    low: 1,
    showGridBackground: false,
    height: "300px",
    axisY: {
        // The offset of the chart drawing area to the border of the container
        offset: 30, // d: 40
        labelOffset: {
            x: 5, // D.: 0 negative values move labels to left, positive the opposite.
            y: 0,
        },
        // If the axis grid should be drawn or not
        onlyInteger: true,
    },
    axisX: {
        offset: 50, // D: 30
        showGrid: false,
    },
    scaleMinSpace: 35, // D. 20
    chartPadding: {
        top: 25,
        right: 15,
        bottom: 5,
        left: 10,
    },
    ...plugins,
};

// if dataArray contains 0, it should be "0.01", otherwise it will be undefined
// data example:
// xLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
// dataArray = [50, 50, 50, "0.01", 50, 50, 50, 50, 50, 50],
// LESSON: this graph only appears when there are at least 2 in the total.
export default function BarChart({
    xLabels,
    dataArray,
    onlySmall = false, // useful especially when used in a modal when the width is limited regardless of the screen width size.
}) {
    const totalData = getTotalData(dataArray);

    useEffect(() => {
        if (!dataArray) return;
        (async () => {
            const chart = new Chartist.Bar(
                ".bar-chart",
                {
                    labels: xLabels,
                    series: [dataArray],
                },
                options
            );

            chart.on("draw", (d) => {
                if (d.type === "bar") {
                    d.element.animate({
                        y2: {
                            begin: 0,
                            dur:
                                (5000 * d.series[d.index]) /
                                Math.max.apply(null, d.series),
                            from: d.y1,
                            to: d.y2,
                            easing: Chartist.Svg.Easing.linear,
                        },
                    });
                    d.group.append(
                        new Chartist.Svg(
                            "circle",
                            {
                                cx: d.x2,
                                cy: d.y2,
                                r: 5,
                            },
                            "peak-circle"
                        )
                    );
                }
            });
        })();
    }, [dataArray]);

    return (
        <section className="bar-chart--root">
            <h2 className="py-3 text-normal font-weight-bold text-white text-center">
                Qtde. clientes e suas notas XP
            </h2>
            <div className="bar-chart" />
            <div
                className="text-white position-relative container-center"
                style={{
                    top: -10,
                }}
            >
                <p
                    className="d-table text-normal font-weight-bold text-shadow"
                    style={{
                        color: "rgb(103, 137, 162)",
                    }}
                >
                    Total: {totalData} clientes
                </p>
            </div>
        </section>
    );
}

function getTotalData(data) {
    return (
        data &&
        data.reduce((acc, next) => {
            if (next === "0.01") return acc;
            return acc + next;
        }, 0)
    );
}
/*
var defaultOptions = {
  // Options for X-Axis
  axisX: {
    // The offset of the chart drawing area to the border of the container
    offset: 30,
    // Position where labels are placed. Can be set to `start` or `end` where `start` is equivalent to left or top on vertical axis and `end` is equivalent to right or bottom on horizontal axis.
    position: 'end',
    // Allows you to correct label positioning on this axis by positive or negative x and y offset.
    labelOffset: {
      x: 0,
      y: 0
    },
    // If labels should be shown or not
    showLabel: true,
    // If the axis grid should be drawn or not
    showGrid: true,
    // Interpolation function that allows you to intercept the value from the axis label
    labelInterpolationFnc: Chartist.noop,
    // This value specifies the minimum width in pixel of the scale steps
    scaleMinSpace: 20,
    // Use only integer values (whole numbers) for the scale steps
    onlyInteger: false
  },
  // Options for Y-Axis
  axisY: {
    // The offset of the chart drawing area to the border of the container
    offset: 40,
    // Position where labels are placed. Can be set to `start` or `end` where `start` is equivalent to left or top on vertical axis and `end` is equivalent to right or bottom on horizontal axis.
    position: 'start',
    // Allows you to correct label positioning on this axis by positive or negative x and y offset.
    labelOffset: {
      x: 0,
      y: 0
    },
    // If labels should be shown or not
    showLabel: true,
    // If the axis grid should be drawn or not
    showGrid: true,
    // Interpolation function that allows you to intercept the value from the axis label
    labelInterpolationFnc: Chartist.noop,
    // This value specifies the minimum height in pixel of the scale steps
    scaleMinSpace: 20,
    // Use only integer values (whole numbers) for the scale steps
    onlyInteger: false
  },
  // Specify a fixed width for the chart as a string (i.e. '100px' or '50%')
  width: undefined,
  // Specify a fixed height for the chart as a string (i.e. '100px' or '50%')
  height: undefined,
  // Overriding the natural high of the chart allows you to zoom in or limit the charts highest displayed value
  high: undefined,
  // Overriding the natural low of the chart allows you to zoom in or limit the charts lowest displayed value
  low: undefined,
  // Unless low/high are explicitly set, bar chart will be centered at zero by default. Set referenceValue to null to auto scale.
  referenceValue: 0,
  // Padding of the chart drawing area to the container element and labels as a number or padding object {top: 5, right: 5, bottom: 5, left: 5}
  chartPadding: {
    top: 15,
    right: 15,
    bottom: 5,
    left: 10
  },
  // Specify the distance in pixel of bars in a group
  seriesBarDistance: 15,
  // If set to true this property will cause the series bars to be stacked. Check the `stackMode` option for further stacking options.
  stackBars: false,
  // If set to 'overlap' this property will force the stacked bars to draw from the zero line.
  // If set to 'accumulate' this property will form a total for each series point. This will also influence the y-axis and the overall bounds of the chart. In stacked mode the seriesBarDistance property will have no effect.
  stackMode: 'accumulate',
  // Inverts the axes of the bar chart in order to draw a horizontal bar chart. Be aware that you also need to invert your axis settings as the Y Axis will now display the labels and the X Axis the values.
  horizontalBars: false,
  // If set to true then each bar will represent a series and the data array is expected to be a one dimensional array of data values rather than a series array of series. This is useful if the bar chart should represent a profile rather than some data over time.
  distributeSeries: false, // this is showing nothing...
  // If true the whole data is reversed including labels, the series order as well as the whole series data arrays.
  reverseData: false,
  // If the bar chart should add a background fill to the .ct-grids group.
  showGridBackground: false,
  // Override the class names that get used to generate the SVG structure of the chart
  classNames: {
    chart: 'ct-chart-bar',
    horizontalBars: 'ct-horizontal-bars',
    label: 'ct-label',
    labelGroup: 'ct-labels',
    series: 'ct-series',
    bar: 'ct-bar',
    grid: 'ct-grid',
    gridGroup: 'ct-grids',
    gridBackground: 'ct-grid-background',
    vertical: 'ct-vertical',
    horizontal: 'ct-horizontal',
    start: 'ct-start',
    end: 'ct-end'
  }
};
 */
