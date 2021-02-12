import React from 'react';

export default function RadiusBtn({
    selectedColor,
    onClick,
    className,
    name,
    backgroundColor,
    color,
    padding,
    size,
    position,
    top,
    left,
    value, }) {

    let styles = {
        btn: {
            position,
            top,
            left,
            padding: padding || '10px',
            borderRadius: '50px',
            backgroundColor: backgroundColor || 'var(--lightGrey)',
            outline: "none",
            width: size || '70px',
            height: size || '70px',
        }
    }

    // const extraSmallConfig = {
    //     position,
    //     top,
    //     left,
    //     padding: '10px',
    //     borderRadius: '50px',
    //     backgroundColor: 'var(--themeSDark)',
    //     outline: "none",
    //     width: '70px',
    //     height: '70px',
    //     fontSize: "12px",
    // }

    if(size === 'small') {
        className = "my-1";
    }

    const showCircleColor = () => (
        <div style={{
            backgroundColor: selectedColor || 'var(--mainDark)',
            borderRadius: '50px',
            filter: 'drop-shadow(.001em .1em .1em var(--mainDark))',
            width: '100%',
            height: '100%',
        }}></div>
    );

    return (
        <button
            className={className}
            style={styles.btn}
            onClick={onClick}
            type='button'
            name={name}
            value={value}
        >
            {showCircleColor()}
        </button>
    );
}