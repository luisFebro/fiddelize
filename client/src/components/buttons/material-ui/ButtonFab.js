import React, { useState } from 'react';
import Fab from '@material-ui/core/Fab';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import { buttonFabType } from '../../../types';

ButtonFab.propTypes = buttonFabType;

export const muStyle = {
    transform: 'scale(1.2)',
    marginLeft: '3px',
}

export const faStyle = {
    fontSize: '30px',
    filter:  'drop-shadow(.5px .5px 1.5px black)',
    color: 'white',
}

export const faStyleSmall = {
    fontSize: '25px',
}

const handleBtnShadow = (shadowColor, custom) => {
    if(shadowColor) {
        return `drop-shadow(.001em .15em .2em ${shadowColor})`;
    }

    if(custom) {
        return `drop-shadow(${custom})`;
    }

    return '';
}

// NEED CHANGE ICON TO FONT AWESOME TOBE MORE FLEXIBLE
export default function ButtonFab({
    variant,
    position,
    size,
    top,
    right,
    left,
    color,
    fontSize,
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
    shadowColor,
    shadowColorCustom,
    title,
    id,
    textTransform,
    needTxtNoWrap,
    needBtnShadow,
    onMouseOver, }) {
    const [toggle, setToggle] = useState('');

    const styles = {
        icon: {
            fontSize: iconFontSize,
            marginLeft: iconMarginLeft,
        },
        fab: {
            fontWeight: fontWeight,
            fontSize: fontSize,
            position: position || 'absolute',
            top: `${top || 0}px`,
            left: `${left || 0}px`,
            outline: 'none',
            color: color || 'var(--mainWhite)',
            backgroundColor:  backgroundColor || "#4834d4",
            filter: needBtnShadow && handleBtnShadow(shadowColor, shadowColorCustom),
        }
    }

    const showIcon = iconFontAwesome => {
        if(iconFontAwesome && typeof iconFontAwesome !== "string") {
            return(
                <i className={`${variant === 'extended' && "ml-2"} ${needIconShadow ? "icon-shadow" : ""}`}>
                    {toggle ? iconAfterClick : iconFontAwesome}
                </i>
            );
        }

        return(
            iconFontAwesome &&
            <i
                style={styles.icon}
                className={toggle ? iconAfterClick : iconFontAwesome}
            ></i>
        );
    }

    const showMuIcon = iconMu => (
        <i className={`${variant === 'extended' && "ml-2"} icon-shadow`}>
            {iconMu}
        </i>
    );

    const handleToggle = () => {
        if(toggle) {
            setToggle("");
        } else {
            setToggle(toggleStatus);
        }
    }

    const handleOnClick = () => {
        if(iconAfterClick && needClickAndToggle) {
            handleToggle();
            onClick();
        } else if (iconAfterClick) {
            handleToggle();
        } else {
            return false;
        }
    }

    return (
        <Fab
            id={id}
            variant={variant || "round"}
            onClick={() => handleOnClick() === false ? onClick() : handleOnClick()}
            onMouseOver={onMouseOver}
            size={ size || "small" }
            aria-label={title}
            style={styles.fab}
        >
            <span
                className={`${needTxtNoWrap ? "text-nowrap" : ""} d-flex align-self-items text-shadow text-normal font-weight-bold`}
                style={{textTransform: textTransform || 'capitalize'}}
            >
                {title}
                {showIcon(iconFontAwesome)}
                {showMuIcon(iconMu)}
            </span>
        </Fab>
    );
}