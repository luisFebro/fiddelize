/** react.js version
 * a component for a react component to show percentage circle
 * */
// reference: https://github.com/JackPu/reactjs-percentage-circle/tree/master/src
import { Component } from "react";
import PropTypes from "prop-types";

require("./style.css");

class ReactjsPercentageCircle extends Component {
    constructor(props) {
        super(props);
        const { percent } = props;

        const {
            leftTransformerDegree,
            rightTransformerDegree,
        } = handleProgressColor(percent);

        this.state = {
            percent: this.props.percent,
            borderWidth:
                this.props.borderWidth < 2 || !this.props.borderWidth
                    ? 2
                    : this.props.borderWidth,
            leftTransformerDegree,
            rightTransformerDegree,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        // prevProps === current updated value
        if (prevProps.percent !== prevState.percent) {
            this.updateProgressColor(prevProps.percent);
        }
    }

    updateProgressColor(perc) {
        const {
            leftTransformerDegree: newLeft,
            rightTransformerDegree: newRight,
        } = handleProgressColor(perc);

        this.setState({
            percent: perc,
            leftTransformerDegree: newLeft,
            rightTransformerDegree: newRight,
        });
    }

    render() {
        return (
            <div
                className="circle"
                style={{
                    width: this.props.radius * 2,
                    height: this.props.radius * 2,
                    borderRadius: this.props.radius,
                    backgroundColor: this.props.bgcolor,
                }}
            >
                <div
                    className="left-wrap"
                    style={{
                        width: this.props.radius,
                        height: this.props.radius * 2,
                        left: 0,
                    }}
                >
                    <div
                        className="loader"
                        id="id1"
                        style={{
                            left: this.props.radius,
                            width: this.props.radius,
                            height: this.props.radius * 2,
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            backgroundColor: this.props.color,
                            transform: `rotate(${this.state.leftTransformerDegree})`,
                        }}
                    />
                </div>
                <div
                    className="right-wrap"
                    style={{
                        width: this.props.radius,
                        height: this.props.radius * 2,
                        left: this.props.radius,
                    }}
                >
                    <div
                        className="loader2"
                        id="id2"
                        style={{
                            left: -this.props.radius,
                            width: this.props.radius,
                            height: this.props.radius * 2,
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            backgroundColor: this.props.color,
                            transform: `rotate(${this.state.rightTransformerDegree})`,
                        }}
                    />
                </div>
                <div
                    className="inner-circle"
                    style={{
                        left: this.props.borderWidth,
                        top: this.props.borderWidth,
                        width: (this.props.radius - this.props.borderWidth) * 2,
                        height:
                            (this.props.radius - this.props.borderWidth) * 2,
                        borderRadius:
                            this.props.radius - this.props.borderWidth,
                        backgroundColor: this.props.innerColor,
                        filter:
                            "drop-shadow(.001em .001em .1em var(--mainDark))",
                    }}
                >
                    {this.props.children ? (
                        this.props.children
                    ) : (
                        <p
                            className="m-0 position-relative"
                            style={{
                                ...this.props.textStyle,
                                textShadow: "none",
                                top: 10,
                            }}
                        >
                            {this.props.percent}%
                            <span
                                className="d-block position-relative text-small font-weight-bold"
                                style={{
                                    top: -15,
                                }}
                            >
                                concluído
                            </span>
                        </p>
                    )}
                </div>
            </div>
        );
    }
}

ReactjsPercentageCircle.propTypes = {
    color: PropTypes.string,
    bgcolor: PropTypes.string,
    innerColor: PropTypes.string,
    radius: PropTypes.number,
    percent: PropTypes.number,
    borderWidth: PropTypes.number,
    textStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

ReactjsPercentageCircle.defaultProps = {
    color: "#000",
    radius: 20,
    percent: 0,
    borderWidth: 2,
    bgcolor: "#e3e3e3",
    innerColor: "#fff",
    disabled: false,
    textStyle: "",
};

// HELPERS
function handleProgressColor(percent) {
    let leftTransformerDegree = "0deg";
    let rightTransformerDegree = "0deg";
    if (percent >= 50) {
        rightTransformerDegree = "180deg";
        leftTransformerDegree = `${(percent - 50) * 3.6}deg`;
    } else {
        rightTransformerDegree = `${percent * 3.6}deg`;
        leftTransformerDegree = "0deg";
    }

    return {
        leftTransformerDegree,
        rightTransformerDegree,
    };
}
// END HELPERS

export default ReactjsPercentageCircle;
