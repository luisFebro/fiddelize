import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import animateCSS from "../../utils/animateCSS";

CloseButton.propTypes = {
    onClick: PropTypes.func,
    size: PropTypes.string,
    color: PropTypes.string,
    top: PropTypes.string,
    left: PropTypes.string,
    delay: PropTypes.number,
};
export default function CloseButton({
    delay,
    onClick,
    className,
    size,
    color,
    top,
    left,
    right,
    bottom,
    position,
}) {
    const styles = {
        closeBtn: {
            position: position || "fixed",
            top,
            left,
            right,
            bottom,
            fontSize: size || "1.9em",
            color: color || "var(--mainWhite)",
            cursor: "pointer",
            zIndex: 1500,
            filter: "drop-shadow(0.001em 0.1em 0.1em grey)",
        },
    };

    const closeBtn = (e) => {
        const elem = e.currentTarget;
        elem.classList.remove(
            "animated",
            "rotateIn",
            typeof delay === "number" ? `delay-${delay}s` : "delay-2s"
        );
        animateCSS(elem, "rotateOut", "normal", () => onClick());
    };

    return (
        <FontAwesomeIcon
            icon="times-circle"
            style={styles.closeBtn}
            className={`${className} cursor-pointer animated rotateIn delay-1s`}
            onClick={(e) => closeBtn(e)}
        />
    );
}
