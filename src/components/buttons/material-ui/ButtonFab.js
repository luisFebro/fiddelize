import { useState, Fragment } from "react";
import Fab from "@material-ui/core/Fab";
import { buttonFabType } from "../../../types";

ButtonFab.propTypes = buttonFabType;

export const muStyle = {
    transform: "scale(1.2)",
    marginLeft: "3px",
};

export const faStyle = {
    fontSize: "30px",
    filter: "drop-shadow(.5px .5px 1.5px black)",
    color: "white",
};

export const faStyleSmall = {
    fontSize: "25px",
};

const handleBtnShadow = (shadowColor, custom) => {
    if (shadowColor) {
        return `drop-shadow(.001em .15em .2em ${shadowColor})`;
    }

    if (custom) {
        return `drop-shadow(${custom})`;
    }

    return "";
};

// NEED CHANGE ICON TO FONT AWESOME TOBE MORE FLEXIBLE
export default function ButtonFab({
    variant = "round",
    position = "absolute",
    size = "small",
    top,
    right,
    bottom,
    left,
    color,
    fontSize,
    fontSizeTxt,
    fontWeight,
    backgroundColor,
    iconMu,
    iconFontAwesome,
    toggleStatus,
    iconAfterClick = null,
    needClickAndToggle = false,
    iconMarginLeft,
    iconFontSize,
    needIconShadow = true,
    onClick,
    needBtnShadow,
    shadowColor,
    shadowColorCustom,
    title,
    titleSize,
    id,
    textTransform,
    needTxtNoWrap,
    onMouseOver,
    zIndex,
    width,
    height,
    disabled = false,
}) {
    const [toggle, setToggle] = useState("");

    const styles = {
        icon: {
            fontSize: iconFontSize,
            marginLeft: iconMarginLeft,
        },
        fab: {
            fontWeight,
            fontSize,
            position,
            top,
            left,
            bottom,
            right,
            zIndex,
            width,
            height,
            outline: "none",
            color: color || "var(--mainWhite)",
            backgroundColor: backgroundColor || "#4834d4",
            filter:
                needBtnShadow &&
                handleBtnShadow(shadowColor, shadowColorCustom),
        },
    };

    const showIcon = (iconFontAwesome) => {
        if (iconFontAwesome && typeof iconFontAwesome !== "string") {
            return (
                <i
                    className={`${variant === "extended" && "ml-2"} ${
                        needIconShadow ? "icon-shadow" : ""
                    }`}
                >
                    {toggle ? iconAfterClick : iconFontAwesome}
                </i>
            );
        }

        return (
            iconFontAwesome && (
                <i
                    style={styles.icon}
                    className={toggle ? iconAfterClick : iconFontAwesome}
                />
            )
        );
    };

    const showMuIcon = (iconMu) => (
        <i className={`${variant === "extended" && "ml-2"} icon-shadow`}>
            {iconMu}
        </i>
    );

    const handleToggle = () => {
        if (toggle) {
            setToggle("");
        } else {
            setToggle(toggleStatus);
        }
    };

    const isClickFunc = typeof onClick === "function";

    const handleOnClick = () => {
        if (iconAfterClick && needClickAndToggle) {
            handleToggle();
            if (isClickFunc) onClick();
        } else if (iconAfterClick) {
            handleToggle();
        } else {
            return false;
        }
    };

    return (
        <Fab
            id={id}
            variant={variant}
            onClick={() =>
                handleOnClick() === false
                    ? isClickFunc && onClick()
                    : handleOnClick()
            }
            onMouseOver={onMouseOver}
            size={size}
            aria-label={title}
            style={styles.fab}
            disabled={disabled}
        >
            {typeof title !== "string" && typeof title !== "undefined" ? (
                <Fragment>{title}</Fragment>
            ) : (
                <span
                    className={`${
                        needTxtNoWrap ? "text-nowrap" : ""
                    } d-flex align-self-items text-shadow ${
                        titleSize ? `text-${titleSize}` : "text-normal"
                    } font-weight-bold`}
                    style={{ textTransform: textTransform || "capitalize" }}
                >
                    {title}
                    {iconFontAwesome && showIcon(iconFontAwesome)}
                    {iconMu && showMuIcon(iconMu)}
                </span>
            )}
        </Fab>
    );
}
