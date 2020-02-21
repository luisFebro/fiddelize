import React, { useState } from 'react';
import Fab from '@material-ui/core/Fab';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import { buttonFabType } from '../../../types';

ButtonFab.propTypes = buttonFabType;

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
    iconFontAwesome,
    iconAfterClick,
    iconMarginLeft,
    iconFontSize,
    actionAfterClick,
    onClick,
    shadowColor,
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
            filter: shadowColor ? `drop-shadow(.001em .15em .2em ${shadowColor})` : '',
        }
    }

    const showIcon = iconFontAwesome => (
        iconFontAwesome &&
        <i style={styles.icon} className={toggle ? iconAfterClick : iconFontAwesome}></i>
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
            <span className="text-shadow">
                {title}
                {showIcon(iconFontAwesome)}
            </span>
        </Fab>
    );
}