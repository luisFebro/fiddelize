import React from 'react';
import PropTypes from 'prop-types';

Display.propTypes = {
    display: PropTypes.string,
}
export default function Display({ display }) {

    return (
        <div
            style={{fontSize: '2.35em', background: 'linear-gradient(to right, var(--themeP), var(--themePDark))'}}
            className="text-center text-white text-title text-nowrap font-weight-bold py-3"
        >
         {display}
        </div>
    );
}