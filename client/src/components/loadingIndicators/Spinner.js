import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { spin } from '../../keyframes/spin';
import Picture from '../../components/Picture';
import PropTypes from 'prop-types';

const logoOpts = {
    large: '100px',
    small: '50px',
}

const SpinnerInner = styled.div`
    position: relative;
    height: ${({ size }) => logoOpts[size]};
    width: ${({ size }) => logoOpts[size]};

    border: 3px solid #f3f3f3;
    border-top: 3px solid var(--lightPurple);
    border-radius: 100%;

    animation: ${spin} .8s linear infinite;
`;

Spinner.propTypes = {
    expireSec: PropTypes.number,
    size: PropTypes.oneOf(['small', 'large']),
    logo: PropTypes.oneOf(['white', 'purple']),
}

export default function Spinner({
    expireSec,
    marginX, marginY,
    isCenter = true,
    size = "small"
    ,logo }) {
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
        <SpinnerInner size={size} />
    );

    const heightCond = typeof marginY === "number" ? (marginY - logoOpts[size]) / 2  : (marginX - logoOpts[size]) / 2;
    const widthCond = (marginX - logoOpts[size]) / 2;
    const calculatedRelativeMargin = `${heightCond}px ${widthCond}px`;
    return (
        <section
            className={`${isCenter && "container-center"} ${logo ? "container-center-col" : null}`}
        >
            <div style={{margin: !marginX ? 0 : calculatedRelativeMargin, minHeight: !marginY ? "85px" : marginY }}>
                {logo && (
                    <Picture
                        path={`/img/official-logo-${logo}`}
                        className="svg-elevation mb-4"
                        alt="logo"
                        width={70}
                        height='auto'
                    />
                )}
            </div>
            {showSpinner(run)}
        </section>
    );
}


/* ARCHIVES
const SpinnerInner = styled(Wrapper)`
`;

let config = {
    center: 'container-center',
    left: '?',
    right: '?',
    none: ''
}
 */

/* concept from: https://codepen.io/smashtheshell/pen/jqGxzr*/