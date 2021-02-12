import React from 'react';
import PropTypes from 'prop-types';
import Img from '../components/Img';

const isSmall = window.Helper.isSmallScreen();

DashSectionTitle.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired
};

const getStyles = () => ({
    title: {
        top: '45%',
        minWidth: isSmall ? '350px' : '700px',
        lineHeight: '10px',
        color: 'var(--mainWhite)',
        background: 'inherit',
    },
});


function DashSectionTitle({
    title, backgroundColor
}) {
    const styles = getStyles();

    return (
        <div className="container-center">
            <div className="d-block position-relative">
                <Img
                    src={"/img/shapes/blob-dashboard-header.svg"}
                    offline={true}
                    coll="illustrations"
                    width={440}
                    needLoader={false}
                    height={155}
                    alt="forma título"
                />
                <h2
                    className="animated zoomIn delay-1s center-to-img position-absolute text-title text-shadow text-center mb-5"
                    style={styles.title}
                >
                    {title}
                </h2>
            </div>
        </div>
    );
}

export default DashSectionTitle;