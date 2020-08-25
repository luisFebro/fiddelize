import React from 'react';
import PropTypes from 'prop-types';

IconAndTitle.propTypes = {
    title: PropTypes.string,
    titleIcon: PropTypes.object,
}
export default function IconAndTitle({
    title,
    titleIcon,
    colorP,
}) {
    return (
        <div
            style={{
                background: `linear-gradient(to right, var(--themePLight--${colorP}), var(--themePDark--${colorP}))`,
                borderTop: '4px solid var(--mainWhite)',
                borderBottom: '4px solid var(--mainWhite)',
                textAlign: 'center',
                overflow: 'hidden',
                paddingLeft: "2rem",
                paddingRight: "2rem",
            }}
            className="d-flex flex-row text-white align-items-center"
        >
            <div
                style={{
                    width: '15%',
                    margin: '0 8px',
                }}
                className="d-flex align-items-center justify-content-center p-2 mr-2"
            >
                <i
                    style={{
                        fontSize: '2.8em',
                        marginLeft: '5px',
                        filter: 'drop-shadow(.001em .1em .1em var(--mainDark))',
                    }}
                >
                 {titleIcon}
                </i>
            </div>
            <div
                className="text-subtitle font-weight-bold mx-2"
            >
                <span className="text-shadow" style={{ margin: 'auto', width: '80%'}}>
                    {title}
                </span>
            </div>
        </div>
    );
}