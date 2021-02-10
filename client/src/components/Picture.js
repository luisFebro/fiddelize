import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import useElemShowOnScroll from "../hooks/scroll/useElemShowOnScroll";

Picture.propTypes = {
    path: PropTypes.string,
    lazyLoading: PropTypes.object,
};

export default function Picture({
    path,
    isResponsive = false,
    callback = () => null,
    // loadingOpts = {},
    ...props
}) {
    const triggered = useElemShowOnScroll("[data-class]", {
        withObserver: true,
        rootMargin: 200,
        loadImgs: true,
        needAnima: true,
        animaIn: "fadeInBottomLeft",
        speed: "slow",
    });

    useEffect(() => {
        if (triggered) {
            callback();
        }
    }, [triggered, callback]);

    const dataSrc = props.dataSrc;
    const dataClass = props.dataClass;
    const lazyActive = dataSrc && dataClass;

    const png = `${path}.png`;
    const webp = `${path}.webp`;

    const triggeredImg = (path) => {
        if (!lazyActive) {
            return path;
        } else {
            return triggered ? path : null;
        }
    };

    return (
        <picture>
            {isResponsive ? (
                <Fragment>
                    <source
                        srcSet={triggeredImg(webp)}
                        media="(min-width: 500px)"
                    />
                    <source
                        srcSet={triggeredImg(`${path}-small.webp`)}
                        media="(max-width: 500px)"
                    />
                    <source
                        srcSet={triggeredImg(png)}
                        media="(min-width: 500px)"
                    />
                    <source
                        srcSet={triggeredImg(`${path}-small.png`)}
                        media="(max-width: 500px)"
                    />
                </Fragment>
            ) : (
                <Fragment>
                    <source srcSet={triggeredImg(webp)} type="image/webp" />
                    <source srcSet={triggeredImg(png)} type="image/png" />
                </Fragment>
            )}

            <img
                className={props.className}
                src={triggeredImg(png)}
                data-src={dataSrc}
                data-class={dataClass}
                alt={props.alt}
                width={props.width}
                height={props.height || "auto"}
                onError={() => (props.onError.src = `${path}.png`)}
            />
        </picture>
    );
}
