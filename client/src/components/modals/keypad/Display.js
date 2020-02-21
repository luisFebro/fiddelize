import React from 'react';
import PropTypes from 'prop-types';

Display.propTypes = {
    display: PropTypes.string,
}
export default function Display({ display }) {

    return (
        <div
            style={{background: 'linear-gradient(to right, #16222a, #3a6073)', fontSize: '2.5em'}}
            className="text-center text-white font-weight-bold py-1"
        >
         {display}
        </div>
    );
}