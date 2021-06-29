import PropTypes from "prop-types";
import parse from "html-react-parser";

Title.propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    color: PropTypes.string,
    subColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    margin: PropTypes.string,
    padding: PropTypes.string,
    className: PropTypes.string,
};

export default function Title({
    title,
    subTitle,
    color,
    subColor,
    backgroundColor,
    margin,
    padding,
    className,
    needShadow,
    subTitleClassName,
    fontSize,
    lineHeight,
}) {
    return (
        <div
            className={`${className || ""} ${
                fontSize || "text-title"
            } ${margin} ${needShadow ? "text-shadow" : ""} ${
                padding || "p-3"
            } text-center`}
            style={{ color, backgroundColor, lineHeight }}
        >
            {parse(title)}
            <p
                className={`${subTitleClassName} text-normal font-weight-bold mb-3`}
                style={{
                    color: subColor || color,
                    marginBottom: 0,
                }}
            >
                {subTitle && parse(subTitle)}
            </p>
        </div>
    );
}
