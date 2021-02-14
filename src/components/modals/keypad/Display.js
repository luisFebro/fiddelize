import PropTypes from "prop-types";
import selectTxtStyle from "../../../utils/biz/selectTxtStyle";

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
            className={`${selectTxtStyle(
                colorP
            )} text-center text-title text-nowrap font-weight-bold py-3`}
        >
            {display}
        </div>
    );
}
