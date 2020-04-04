import React from 'react';

export default function RadiusBtn({
    title,
    onClick,
    className,
    backgroundColor,
    color, fontSize, padding, needTxtShadow = true, size }) {
    if(size === 'small') {
        className = "my-1";
        fontSize = "15px";
    }

    const styles = {
        btn: {
            //position: 'absolute',
            //top: '45px',
            //right: '5px',
            color: color || "white",
            padding: padding || '2px 8px',
            borderRadius: '20px',
            backgroundColor: backgroundColor || 'var(--themeSDark)',
            outline: "none",
            fontSize: fontSize || '20px',
        }
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