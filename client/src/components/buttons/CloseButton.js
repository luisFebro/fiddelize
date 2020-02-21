import React from 'react';
import PropTypes from 'prop-types';

CloseButton.propTypes = {
    onClick: PropTypes.func,
    size: PropTypes.string,
    color: PropTypes.string,
    top: PropTypes.string,
    left: PropTypes.string,
}
export default function CloseButton({
    onClick,
    size,
    color,
    top,
    left,
    right
}) {
    const styles = {
        closeBtn: {
            position: 'fixed',
            top: top || '0px',
            left: left,
            right: right,
            cursor: 'pointer',
            fontSize: size || '1.9em',
            color: color || 'var(--mainWhite)',
            zIndex: 1500,
            filter: 'drop-shadow(0.001em 0.1em 0.1em var(--mainDark))'
        }
    }

    const closeBtn = () => {
        const closeBtn = document.getElementById('closeBtn');
        closeBtn.className = 'fas fa-times-circle animated rotateOut';
        setTimeout(() => onClick(), 500)
    };

    return (
        <i
            id="closeBtn"
            style={styles.closeBtn}
            className="fas fa-times-circle animated rotateIn delay-2"
            onClick={closeBtn}
        >
        </i>
    );
}