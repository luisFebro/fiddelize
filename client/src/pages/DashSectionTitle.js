import React from 'react';
import PropTypes from 'prop-types';
import { CLIENT_URL } from '../config/clientUrl';
import imgLib, { ImgLoader } from '../utils/storage/lForageStore';
const isSmall = window.Helper.isSmallScreen();

DashSectionTitle.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired
};

export default function DashSectionTitle({ title, backgroundColor }) {
    return (
        <div className="container-center">
            <div className="position-relative">
                <ImgLoader
                    id="dash_title_shape"
                    src={imgLib.dash_title_shape}
                    width={440}
                    height={155}
                    alt="forma título"
                />
                <h2
                    className="animated zoomIn delay-1s     center-to-img position-absolute text-title text-shadow text-center mb-5"
                    style={{
                        top: '45%',
                        minWidth: isSmall ? '350px' : '700px',
                        lineHeight: '10px',
                        color: 'var(--mainWhite)',
                        background: 'inherit',
                    }}
                >
                    {title}
                </h2>
            </div>
        </div>
    );
}
