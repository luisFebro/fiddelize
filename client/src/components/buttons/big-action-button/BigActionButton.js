import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import './pressedEffect.css'

const isSmall = window.Helper.isSmallScreen();

BigActionButton.propTypes = {
    title: PropTypes.string.isRequired,
    fontAwesomeIcon: PropTypes.string,
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
    backColorOnHover: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
}

export default function BigActionButton({
    title,
    color,
    backgroundColor,
    backColorOnHover,
    backColorOnKey,
    className,
    onClick,
    fontAwesomeIcon
}) {
    const styles = {
        color: color || "var(--mainWhite)",
        backgroundColor: backgroundColor || "var(--mainDark)",
        outline: 'none',
        border: 'none',
        fontWeight: 'bolder',
        fontSize: '1.5em',
        maxWidth: '250px',
        width: '100%',
        padding: '25px 15px',
        borderRadius: '20px',
    }
    return (
        <button
            style={styles}
            className={`${className} pressed-effect d-flex text-center text-shadow align-items-center`}
            onClick={onClick}
            onMouseOver={e => e.target.style.backgroundColor=backColorOnHover}
            onMouseOut={e => e.target.style.backgroundColor=backgroundColor}
            onKeyDown={e => e.target.style.backgroundColor=backColorOnKey}
        >
            {title}
            <i
                className={`${fontAwesomeIcon} text-em-1-9 ${isSmall ? "ml-1" : "ml-3"}`}
            >
            </i>
        </button>
    );
}

