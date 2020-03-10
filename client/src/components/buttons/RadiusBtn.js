import React from 'react';

export default function RadiusBtn({ title, onClick }) {
    const styles = {
        btn: {
            //position: 'absolute',
            //top: '45px',
            //right: '5px',
            color: "white",
            padding: '2px 5px',
            borderRadius: '20px',
            backgroundColor: 'var(--themeSDark)',
            outline: "none"
        }
    }
    return (
        <button
            className="text-small text-shadow font-weight-bold"
            style={styles.btn}
            onClick={onClick}
        >
            {title}
        </button>
    );
}