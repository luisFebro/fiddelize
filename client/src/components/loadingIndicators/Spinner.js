import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { spin } from '../../keyframes/spin';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
    height: 100px;
    width: 100px;
    margin: 50px 150px;

    border: 2px solid #f3f3f3;
    border-top: 3px solid var(--mainPink);
    border-radius: 100%;

    animation: ${spin} .8s linear infinite;
`;

const SpinnerInner = styled(Wrapper)`
    position: relative;
`;

Spinner.propTypes = {
    expireSec: PropTypes.number,
    alignment: PropTypes.oneOf(['center', 'left', 'right']),
}

export default function Spinner({ expireSec, alignment = 'center' }) {
    const [run, setRun] = useState(true);
    // Not working with callback
    const stopSpinnerAfter = useCallback(() => {
        const milisecs = expireSec * 1000;
        console.log(milisecs)
        return expireSec && setTimeout(() => setRun(false), milisecs);
    }, [expireSec])

    useEffect(() => {
        const timer = stopSpinnerAfter;
        return () => { clearTimeout(timer) }
    }, [stopSpinnerAfter])

    const showSpinner = isRunning => (
        isRunning &&
        <SpinnerInner />
    );

    let config = {
        center: 'container-center',
        left: '?',
        right: '?',
        none: ''
    }

    return (
        <div className={config[alignment]}>
            {showSpinner(run)}
        </div>
    );
}

/* concept from: https://codepen.io/smashtheshell/pen/jqGxzr*/