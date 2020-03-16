import React, { useState } from 'react';
import Fab from '@material-ui/core/Fab';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import { buttonFabType } from '../../../types';

ButtonFab.propTypes = buttonFabType;

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
    iconAfterClick,
    iconMarginLeft,
    iconFontSize,
    actionAfterClick,
    onClick,
    shadowColor,
    shadowColorCustom,
    title }) {
    const [toggle, setToggle] = useState(false);

    const styles = {
        icon: {
            fontSize: iconFontSize,
            marginLeft: iconMarginLeft || '5px',
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
            filter: handleBtnShadow(shadowColor, shadowColorCustom),
        }
    }

    const showIcon = iconFontAwesome => (
        iconFontAwesome &&
        <i style={styles.icon} className={toggle ? iconAfterClick : iconFontAwesome}></i>
    );

    const showMuIcon = iconMu => (
        iconMu && (iconMu)
    );

    const handleToggle = () => {
        setToggle(!toggle);
        actionAfterClick && actionAfterClick.setStatus(!actionAfterClick.status);
        actionAfterClick.setFunction && actionAfterClick.setFunction();
    }


    return (
        <Fab
            variant={variant || "round"}
            onClick={
                iconAfterClick
                ? handleToggle : onClick}
            size={ size || "small" }
            aria-label={title}
            style={styles.fab}
        >
            <span style={{fontFamily: 'var(--mainFont)'}} className="text-shadow">
                {title}
                {showIcon(iconFontAwesome)}
                {showMuIcon(iconMu)}
            </span>
        </Fab>
    );
}