/**
 * Chartist.js plugin to display a data label on top of the points in a line chart.
 *
 */
export default function pluginPointLabels(Chartist) {
    const defaultOptions = {
        labelClass: "ct-label",
        labelOffset: {
            x: 0,
            y: -10,
        },
        textAnchor: "middle",
        align: "center",
        labelInterpolationFnc: Chartist && Chartist.noop,
    };

    const labelPositionCalculation = {
        point(data) {
            return {
                x: data.x,
                y: data.y,
            };
        },
        bar: {
            left(data) {
                return {
                    x: data.x2,
                    y: data.y2,
                };
            },
            center(data) {
                return {
                    x: data.x2 + (data.x2 - data.x2) / 2,
                    y: data.y2,
                };
            },
            right(data) {
                return {
                    x: data.x2,
                    y: data.y2,
                };
            },
        },
    };

    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.ctPointLabels = function (options) {
        options = Chartist.extend({}, defaultOptions, options);

        function addLabel(position, data) {
            // if x and y exist concat them otherwise output only the existing value
            let value =
                data.value.x !== undefined && data.value.y
                    ? `${data.value.x}, ${data.value.y}`
                    : data.value.y || data.value.x;

            // to display zero on the label, not 'undefined'
            if (typeof value === "undefined") {
                value = 0;
            }

            data.group
                .elem(
                    "text",
                    {
                        x: position.x + options.labelOffset.x,
                        y: position.y + options.labelOffset.y,
                        style: `text-anchor: ${options.textAnchor}`,
                    },
                    options.labelClass
                )
                .text(options.labelInterpolationFnc(value));
        }

        return function ctPointLabels(chart) {
            if (
                chart instanceof Chartist.Line ||
                chart instanceof Chartist.Bar
            ) {
                chart.on("draw", (data) => {
                    const positonCalculator =
                        (labelPositionCalculation[data.type] &&
                            labelPositionCalculation[data.type][
                                options.align
                            ]) ||
                        labelPositionCalculation[data.type];
                    if (positonCalculator) {
                        addLabel(positonCalculator(data), data);
                    }
                });
            }
        };
    };
}
