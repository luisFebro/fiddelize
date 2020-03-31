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
                background: 'linear-gradient(to right, var(--themePLight), var(--themePDark))',
                border: 'solid 4px var(--mainDark)',
                textAlign: 'center'
            }}
            className="d-flex flex-row text-white align-items-center"
        >
            <div
                style={{
                    width: '15%',
                    margin: '0 8px'
                }}
                className="d-flex align-items-center justify-content-center p-2 mr-2"
            >
                <i
                    style={{fontSize: '2.8em', marginLeft: '5px'}}
                >
                 {titleIcon}
                </i>
            </div>
            <div
                className="text-subtitle font-weight-bold"
            >
                <span style={{ margin: 'auto', width: '80%'}}>
                    {title}
                </span>
            </div>
        </div>
    );
}