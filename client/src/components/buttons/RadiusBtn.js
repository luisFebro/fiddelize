import React from 'react';

export default function RadiusBtn({ title, onClick, className, backgroundColor }) {
    const styles = {
        btn: {
            //position: 'absolute',
            //top: '45px',
            //right: '5px',
            color: "white",
            padding: '2px 8px',
            borderRadius: '20px',
            backgroundColor: backgroundColor || 'var(--themeSDark)',
            outline: "none"
        }
    }
    return (
        <button
            className={className + " text-small text-shadow font-weight-bold"}
            style={styles.btn}
            onClick={onClick}
            type='button'
        >
            {title}
        </button>
    );
}