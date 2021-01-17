import React, { useState, useEffect } from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import Spinner from "./loadingIndicators/Spinner";
import PropTypes from "prop-types";

CompLoader.propTypes = {
    comp: PropTypes.any,
    mode: PropTypes.oneOf(["skeleton", "spinner"]),
    hide: PropTypes.bool,
    timeout: PropTypes.number,
};

// hide = for dynamic bundle loading, as soon as the bundle loads, set hide to true and spinner will be hided after timeout.
// timeout = a timing span with a spinner to avoid an empty area when loading bundle.

export default function CompLoader({
    comp,
    hide = true, // if there is a condition to hide LOADER
    timeout = 2000,
    align,
    marginY,
    id,
    src,
    width,
    height,
    style,
    alt,
    size,
    className,
    modeProps,
    mode = "spinner",
    needLoader = true,
    logo = false,
}) {
    let [status, setStatus] = useState(true);

    useEffect(() => {
        let runThis;
        let unmounted;

        if (hide && !unmounted) {
            const runThis = setTimeout(() => setStatus(false), timeout);
        }

        return () => {
            clearTimeout(runThis);
            unmounted = true;
        };
    }, [hide]);

    return (
        <div
            style={{ margin: `${marginY || 0}px 0px` }}
            className="container-center"
        >
            <div
                style={{
                    ...style,
                    display: status ? "block" : "none",
                    visibility: !needLoader && "hidden",
                }}
            >
                <Spinner
                    marginX={width}
                    marginY={height}
                    isCenter={false}
                    size={size || "large"}
                    logo={logo ? logo : undefined}
                />
            </div>
            <div style={{ display: status ? "none" : "block" }}>
                {hide ? comp : null}
            </div>
        </div>
    );
}
