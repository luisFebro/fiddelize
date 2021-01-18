// reference: https://codepen.io/JakubHonisek/pen/qjpeeO
import React from "react";
import "./style.css";
import PropTypes from "prop-types";

ScrollArrow.propTypes = {
    margin: PropTypes.number,
    id: PropTypes.string,
};

export default function ScrollArrow({ color, margin, id }) {
    const styles = {
        // NOT WORKING. Need alter chevron:after backgroud...
        array: {
            background: color || "black",
        },
        margin: {
            margin: margin ? `${margin}px 0` : 0,
        },
    };

    return (
        <div id={id} style={styles.margin}>
            <div className="chevron--container">
                <div className="chevron"></div>
                <div className="chevron"></div>
                <div className="chevron"></div>
            </div>
        </div>
    );
}
