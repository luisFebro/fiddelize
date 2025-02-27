// cómponents should be pure without intermidiate components handling props. Otherwise it will pop up some ref errors.
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
// import this to component later!!!
import { default as TooltipMU } from "@material-ui/core/Tooltip";
import { useBizData } from "init";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Zoom from "@material-ui/core/Zoom";
import parse from "html-react-parser";
import "./pulseWaves.css";
import getColor from "styles/txt";

const isSmall = window.Helper.isSmallScreen();

Tooltip.propTypes = {
    text: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    element: PropTypes.element.isRequired,
    needAttentionWaves: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    placement: PropTypes.string,
    width: PropTypes.number,
    whiteSpace: PropTypes.bool,
    padding: PropTypes.string,
};

// IMPORTANT: the element should be wrapped around with a div or i so that it will work properly.export
// ButtonFav will not work without the div element.
/*
element={
    <div>
        <ButtonFab />
    </div>
}
*/
export default function Tooltip({
    text,
    textAlign,
    // color,
    colorS,
    backgroundColor,
    // borderShadow,
    className,
    needArrow,
    element,
    needAttentionWaves,
    placement,
    needOpen,
    whiteSpace = true,
    width,
    margin,
    padding,
    onClickAway,
    hover = false,
    arrowBottom,
    disabled = false,
    disablePortal = false, // need to be true to work in a modal
    // needClickAway = true,
}) {
    const [open, setOpen] = React.useState(false);
    const [stopWave, setStopWave] = React.useState(false);
    // this useEffect solves the problem with uncontrolled vs controlled components handling.

    const { themeBackColor } = useBizData();
    const { txtColorStyle, needDark } = getColor(colorS);
    const needShadow = !needDark;

    useEffect(() => {
        if (needOpen) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [needOpen]);

    const handleTooltipClose = () => {
        if (typeof onClickAway === "function") {
            onClickAway();
        }
        setOpen(false);
    };

    const handleTooltipOpen = () => {
        setOpen(true);
    };

    const radiusTooltipStyle = makeStyles((theme) => ({
        tooltip: {
            textAlign: textAlign || "left",
            fontSize: "15px",
            lineHeight: "20px",
            fontFamily: "var(--mainFont)",
            backgroundColor: backgroundColor || "var(--themeSDark)",
            fontWeight: "bold",
            borderRadius: "15px 15px",
            padding: padding || "10px",
            margin: margin || "40px 0",
            whiteSpace: whiteSpace ? null : "nowrap",
            textShadow: needShadow ? "1px 1px 3px black" : undefined,
            width: width || "100%",
            color: txtColorStyle,
            filter:
                themeBackColor === "black" || colorS === "black"
                    ? "drop-shadow(.001em .1em .1em var(--mainWhite))"
                    : "drop-shadow(.001em .1em .1em var(--mainDark))",
            // top: 20,
        },
        arrow: {
            fontSize: 25,
            color: backgroundColor || "var(--themeSDark)",
            bottom: arrowBottom || undefined,
        },
    }));

    const classes = radiusTooltipStyle();

    // LESSON: PopperProps={{ disablePortal: true }} was causing the issue of popper/tooltip z-index not works and be behind other elements
    // disablePortal - default: false - Disable the portal behavior. The children stay within it's parent DOM hierarchy.
    // keepMounted - default: false - Always keep the children in the DOM. This prop can be useful in SEO situation or when you want to maximize the responsiveness of the Popper.
    return (
        <ClickAwayListener onClickAway={handleTooltipClose}>
            <div
                className={`${className || ""} position-relative c-pointer`}
                onClick={() => setStopWave(true)}
            >
                {needAttentionWaves ? (
                    <div className={`${stopWave ? "" : "pulse-waves"}`}>
                        <span style={{ visibility: "hidden" }} />
                    </div>
                ) : null}

                <TooltipMU
                    style={{ top: 15 }}
                    arrow={!!needArrow}
                    title={typeof text === "string" ? parse(text) : text}
                    classes={classes}
                    onClick={handleTooltipOpen}
                    disableFocusListener
                    disableHoverListener={!(hover && !isSmall)}
                    disableTouchListener
                    interactive
                    onClose={handleTooltipClose}
                    open={disabled || (hover && !isSmall) ? undefined : open}
                    placement={placement || "top"}
                    TransitionComponent={Zoom}
                    TransitionProps={{ timeout: 200 }}
                    PopperProps={{ disablePortal, keepMounted: false }}
                >
                    {element}
                </TooltipMU>
            </div>
        </ClickAwayListener>
    );
}

/* COMMENTS
n1: element only accepts one html tag. If nested, it won't work...
LESSON: empty elements like <i> without an online icon will prevent the tooltip to work properly...
*/

/* ARCHIVES
 let selectedLogic;
    const logic1 = showLevel === elemToOpen ? 'd-block' : 'd-none';
    const logic2 = isOpen ? 'd-block' : 'd-none';

    selectedLogic = logic1;
    if(typeof isOpen === 'boolean') {
        selectedLogic = logic2;
    }
 */
