import React, { useState, useEffect } from "react";
import Skeleton from '@material-ui/lab/Skeleton';
import Spinner from './loadingIndicators/Spinner';
import PropTypes from 'prop-types';

ImgLoader.propTypes = {
    align: PropTypes.string,
    marginY: PropTypes.number,
    mode: PropTypes.oneOf(['skeleton', 'spinner']),
    skelVariant: PropTypes.oneOf(['text', 'rect', 'circle']),
    skelWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    skelHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    skelBackColor: PropTypes.string,
}

export default function ImgLoader({
    align,
    marginY,
    timeout = 0, // disabled as default.
    id,
    src,
    width,
    height,
    style,
    alt,
    className,
    mode = "spinner",
    needLoader = true,
    skelVariant = 'rect',
    skelWidth,
    skelHeight = "auto",
    skelBackColor,
}) {

    let [status, setStatus] = useState(true);

    // useEffect(() => {
    //     if(src && timeout === 0) setStatus(false);
    // }, [src, timeout])

    useEffect(() => {
        if(timeout) setTimeout(() => setStatus(false), timeout);
    }, [timeout])

    const pickMode = mode => {
        if(mode === "spinner") return (<Spinner marginX={width} marginY={height} isCenter={false} />);
        return(
            <Skeleton
                variant={skelVariant}
                width={skelWidth}
                height={skelWidth}
                style={{ maxWidth: '100%', backgroundColor: skelBackColor || 'grey' }}
            />
        );
    };

    return(
        <div style={{margin: `${marginY || 0}px 0px` }} className="container-center">
            <div style={{ ...style, display: status ? 'block' : 'none', visibility: !needLoader && "hidden" }}>
                {pickMode(mode)}
            </div>
            <div style={{ display: status ? 'none' : 'block'}}>
                <img
                    id={id}
                    className={className}
                    src={src}
                    alt={alt || id}
                    style={style}
                    width={width}
                    height={height || "auto"}
                    onLoad={() => !timeout && setStatus(false)}
                />
            </div>
        </div>
    );
}
