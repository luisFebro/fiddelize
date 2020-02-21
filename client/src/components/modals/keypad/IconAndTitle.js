import React from 'react';
import PropTypes from 'prop-types';

IconAndTitle.propTypes = {
    title: PropTypes.string,
    titleIcon: PropTypes.string,
}
export default function IconAndTitle({
    title,
    titleIcon
}) {
    return (
        <div
            style={{
                background: 'linear-gradient(to right, #3a7bd5, #3a6073)',
                border: 'solid 4px var(--mainDark)',
                textAlign: 'center'
            }}
            className="d-flex flex-row text-white"
        >
            <div
                style={{
                    borderRight: 'solid 4px var(--mainDark)',
                    width: '15%',
                    margin: '0 5px'
                }}
                className="d-flex justify-content-center p-2 mr-2"
            >
                <i
                    style={{fontSize: '2.8em'}}
                    className={titleIcon}>
                </i>
            </div>
            <div
                style={{
                    fontSize: '2.1em',
                    fontWeight: 'bolder',
                    margin: 'auto',
                    width: '80%'
                }}
            >
                {title}
            </div>
        </div>
    );
}