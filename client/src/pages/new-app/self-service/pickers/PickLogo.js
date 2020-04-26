import React from 'react';
import PropTypes from 'prop-types';
PickLogo.propTypes = {
    step: PropTypes.number,
    setNextDisabled: PropTypes.func,
}

export default function PickLogo({ step, setNextDisabled }) {
    const handleUpload = () => {
        setNextDisabled(false);
    };

    const showLogoUploadingArea = () => (
        <section className="text-normal text-white">
            I am the logo uploading area
            <button onClick={handleUpload}>
                I am upload btn
            </button>
        </section>
    );

    return (
        step === 1 &&
        <div>
            <p className="text-normal text-white text-shadow text-center">
                • Envie a logo da sua empresa/projeto:
            </p>
            {showLogoUploadingArea()}
        </div>
    );
}