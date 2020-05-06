import React from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';

Title.propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    color: PropTypes.string,
    subColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    margin: PropTypes.string,
    padding: PropTypes.string,
    className: PropTypes.string,

}

export default function Title({
    title,
    subTitle,
    color,
    subColor,
    backgroundColor,
    margin,
    padding,
    className,
    needShadow,
    fontSize, }) {
    return (
        <div
            className={`${className ? className : ''} ${fontSize ? fontSize : 'text-title'} ${margin} ${needShadow ? 'text-shadow' : ''} ${padding || "p-3"} text-center`}
            style={{color: color, backgroundColor: backgroundColor}}
        >
            {parse(title)}
            <p
                className="mt-2 text-subtitle"
                style={{ color: subColor || color, marginBottom: 0, }}
            >
                {subTitle && parse(subTitle)}
            </p>
        </div>
    );
}