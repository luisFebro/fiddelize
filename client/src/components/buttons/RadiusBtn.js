import React from 'react';

export default function RadiusBtn({
    title,
    onClick,
    className,
    backgroundColor,
    color,
    fontSize,
    padding,
    needTxtShadow = true,
    size,
    position,
    top,
    left, }) {

    let styles = {
        btn: {
            position,
            top,
            left,
            color: color || "white",
            padding: padding || '2px 8px',
            borderRadius: '20px',
            backgroundColor: backgroundColor || 'var(--themeSDark)',
            outline: "none",
            fontSize: fontSize || '20px',
        }
    }

    const extraSmallConfig = {
        position,
        top,
        left,
        color: "white",
        padding: '2px 5px',
        borderRadius: '20px',
        backgroundColor: 'var(--themeSDark)',
        outline: "none",
        fontSize: "12px",
    }

    if(size === 'small') {
        className = "my-1";
        fontSize = "15px";
    }

    if(size === "extra-small") {
        styles.btn = extraSmallConfig;
    }

    return (
        <button
            className={className + `text-small ${needTxtShadow ? 'text-shadow' : ''} font-weight-bold`}
            style={styles.btn}
            onClick={onClick}
            type='button'
        >
            {title}
        </button>
    );
}