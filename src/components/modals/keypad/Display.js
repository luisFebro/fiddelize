import PropTypes from "prop-types";
import getColor from "styles/txt";

Display.propTypes = {
    display: PropTypes.string,
};
export default function Display({ display, colorP }) {
    return (
        <div
            style={{
                fontSize: "2.35em",
                background: `linear-gradient(to right, var(--themeP--${colorP}), var(--themePDark--${colorP}))`,
            }}
            className={`${
                getColor(colorP).txtColor
            } text-center text-title text-nowrap font-weight-bold py-3`}
        >
            {display}
        </div>
    );
}
