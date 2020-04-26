import React from 'react';
import PropTypes from 'prop-types';

PickTheming.propTypes = {
    step: PropTypes.number,
    setNextDisabled: PropTypes.func,
}
export default function PickTheming({ step, setNextDisabled }) {
    const handleColors = () => {
        setNextDisabled(false);
    };

    const showThemingArea = () => (
        <section className="text-normal text-white">
            I am the theming area
            <button onClick={handleColors}>
                I am upload btn
            </button>
        </section>
    );

    return (
        step === 2 &&
        <div>
            <p className="text-normal text-white text-shadow text-center">
                • Escolha as cores do seu projeto/empresa:
            </p>
            {showThemingArea()}
        </div>
    );
}