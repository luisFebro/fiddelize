import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import Picture from "../Picture";

const logoOpts = {
    large: "100px",
    small: "50px",
    mini: "20px",
};

Spinner.propTypes = {
    expireSec: PropTypes.number,
    size: PropTypes.oneOf(["mini", "small", "large"]),
    logo: PropTypes.oneOf(["white", "purple", ""]),
};

export default function Spinner({
    expireSec,
    marginX,
    marginY,
    isCenter = true,
    size = "small",
    logo,
    margin,
}) {
    const [run, setRun] = useState(true);
    // Not working with callback
    const stopSpinnerAfter = useCallback(() => {
        const milisecs = expireSec * 1000;
        console.log(milisecs);
        return expireSec && setTimeout(() => setRun(false), milisecs);
    }, [expireSec]);

    useEffect(() => {
        const timer = stopSpinnerAfter;
        return () => {
            clearTimeout(timer);
        };
    }, [stopSpinnerAfter]);

    const showSpinner = (isRunning) =>
        isRunning && (
            <section className="root">
                <div />
                <style jsx>
                    {`
                        .root div {
                            position: relative;
                            height: ${logoOpts[size]};
                            width: ${logoOpts[size]};

                            border: 3px solid #f3f3f3;
                            border-top: 3px solid var(--lightPurple);
                            border-radius: 100%;

                            animation: spin 0.8s linear infinite;
                        }

                        @keyframes spin {
                            from {
                                transform: rotate(0deg);
                            }
                            to {
                                transform: rotate(360deg);
                            }
                        }
                    `}
                </style>
            </section>
        );

    const heightCond =
        typeof marginY === "number"
            ? (marginY - logoOpts[size]) / 2
            : (marginX - logoOpts[size]) / 2;
    const widthCond = (marginX - logoOpts[size]) / 2;
    const calculatedRelativeMargin = `${heightCond}px ${widthCond}px`;

    return (
        <section
            className={`${isCenter && "container-center"} ${
                logo ? "container-center-col" : null
            }`}
            style={{ minHeight: marginY || "85px", margin }}
        >
            <div style={{ margin: !marginX ? 0 : calculatedRelativeMargin }}>
                {logo && (
                    <Picture
                        path={`/img/official-logo-${logo}`}
                        className={`${
                            logo === "purple" ? "" : "svg-elevation"
                        } mb-4`}
                        alt="logo"
                        width={70}
                        height="auto"
                    />
                )}
            </div>
            {showSpinner(run)}
        </section>
    );
}

/* concept from: https://codepen.io/smashtheshell/pen/jqGxzr */
